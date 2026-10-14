/* Shared data layer for the classroom control panel (Firestore). */
(function(){
  if(window.__mdmStore){ window.MDMStore = window.__mdmStore; return; }
  var CFG = {
    apiKey: "AIzaSyCEJtHd802MyuZUlwt6OfGkl9IitHaSOaA",
    authDomain: "tasks-results.firebaseapp.com",
    projectId: "tasks-results",
    storageBucket: "tasks-results.firebasestorage.app",
    messagingSenderId: "1014525306500",
    appId: "1:1014525306500:web:3ffe2e6f5554e9140e04d1"
  };
  var B = "https://www.gstatic.com/firebasejs/10.13.0/";
  function load(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=function(){rej(new Error('Could not load '+src));}; document.head.appendChild(s); }); }
  var db, auth;
  function conv(d){ var o=Object.assign({id:d.id}, d.data()); Object.keys(o).forEach(function(k){ if(o[k]&&typeof o[k].toMillis==='function') o[k]=o[k].toMillis(); }); return o; }
  window.MDMStore = {
    init: async function(needAuth){
      if(!window.firebase||!firebase.initializeApp) await load(B+'firebase-app-compat.js');
      if(!firebase.firestore) await load(B+'firebase-firestore-compat.js');
      if(needAuth && !firebase.auth) await load(B+'firebase-auth-compat.js');
      var app = firebase.apps.filter(function(a){return a.name==='mdm';})[0] || firebase.initializeApp(CFG,'mdm');
      db = app.firestore(); if(needAuth) auth = app.auth();
    },
    serverTime: function(){ return firebase.firestore.FieldValue.serverTimestamp(); },
    set: function(path,data,merge){ return db.doc(path).set(data, merge?{merge:true}:undefined); },
    add: function(coll,data){ return db.collection(coll).add(data); },
    del: function(path){ return db.doc(path).delete(); },
    watchDoc: function(path,cb){ return db.doc(path).onSnapshot(function(s){ cb(s.exists?conv(s):null); }, function(e){ console.warn('mdm watchDoc',path,e&&e.code); }); },
    watchCollection: function(coll,cb,onErr){ return db.collection(coll).onSnapshot(function(s){ cb(s.docs.map(conv)); }, function(e){ if(onErr) onErr(e); }); },
    watchAdded: function(coll,cb){ var first=true; return db.collection(coll).orderBy('createdAt','desc').limit(5).onSnapshot(function(s){ if(first){first=false;return;} s.docChanges().forEach(function(ch){ if(ch.type==='added') cb(conv(ch.doc)); }); }, function(e){ console.warn('mdm watchAdded',e&&e.code); }); },
    classFiles: function(year,cb,onErr){ return db.collection('classfiles').where('year','==',year).onSnapshot(function(s){ cb(s.docs.map(conv)); }, function(e){ if(onErr) onErr(e); }); },
    putClassFile: async function(meta,chunks,progress){
      var ref = db.collection('classfiles').doc();
      for(var i=0;i<chunks.length;i++){ await ref.collection('c').doc(String(i).padStart(3,'0')).set({n:i,d:chunks[i]}); if(progress) progress(i+1,chunks.length); }
      await ref.set(Object.assign({}, meta, {chunks:chunks.length, createdAt: firebase.firestore.FieldValue.serverTimestamp()}));
      return ref.id;
    },
    getClassFile: async function(id,n,progress){
      var out=[];
      for(var i=0;i<n;i++){ var d=await db.collection('classfiles').doc(id).collection('c').doc(String(i).padStart(3,'0')).get(); if(!d.exists) throw new Error('missing part '+i); out.push(d.data().d); if(progress) progress(i+1,n); }
      return out.join('');
    },
    delClassFile: async function(id,n){
      for(var i=0;i<n;i++){ await db.collection('classfiles').doc(id).collection('c').doc(String(i).padStart(3,'0')).delete(); }
      await db.collection('classfiles').doc(id).delete();
    },
    signIn: function(email,pw){ return auth.signInWithEmailAndPassword(email,pw); },
    signOut: function(){ return auth.signOut(); },
    onAuth: function(cb){ return auth.onAuthStateChanged(function(u){ cb(u?{email:u.email}:null); }); }
  };
})();
