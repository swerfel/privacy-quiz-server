(this["webpackJsonpprivacy-quiz"]=this["webpackJsonpprivacy-quiz"]||[]).push([[0],{118:function(e,t,n){"use strict";n.r(t);var r=n(1),c=n(0),i=n.n(c),a=n(21),s=n.n(a),j=(n(78),n(71)),o=n(27),u=n(17),d=(n(79),n(38)),b=n(39),l=n.p+"static/media/Logo.5a9fa48b.jpg";function h(){var e=Object(d.a)(["\n    position: absolute;\n    top: 45px;\n"]);return h=function(){return e},e}function O(){var e=Object(d.a)(["\n    color: white;\n    position: absolute;\n    top: 10px;\n"]);return O=function(){return e},e}function x(){var e=Object(d.a)(["\n    background-color: #1b5f9e;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    color: lightgray;\n    overflow: hidden;\n"]);return x=function(){return e},e}var f=b.a.header(x()),g=b.a.h2(O()),v=b.a.p(h());var m=function(){return Object(r.jsxs)(f,{children:[Object(r.jsx)("img",{src:l,alt:"Logo"}),Object(r.jsx)(g,{children:"Andrena-Privacy"}),Object(r.jsx)(v,{children:"Wie gut kannst du deine Kollegen einsch\xe4tzen?"})]})},p=n(10),y=n(26),w=n(35),S=n(11),A=n(70),F=n(72),k=Object(A.io)();k.on("connect",(function(){console.log("connected");var e=new F.a,t=e.get("PrivacyFirstSocketIdForRecovery");t&&t.length>0?k.emit("restore by id",t):e.set("PrivacyFirstSocketIdForRecovery",k.id,{path:"/"})}));var z=function(e,t){return Object(c.useEffect)((function(){return k.on(e,t),function(){k.off(e)}}),[])};var q=function(){var e=Object(c.useState)(""),t=Object(p.a)(e,2),n=t[0],i=t[1];return Object(r.jsxs)(y.a,{className:"mb-3",children:[Object(r.jsx)(y.a.Prepend,{children:Object(r.jsx)(y.a.Text,{id:"nameLabel",children:"Dein Name"})}),Object(r.jsx)(w.a,{placeholder:"Bitte Name eingeben. (Die Antworten werden nicht gespeichert, nur deine Sch\xe4tzabweichung wird anderen angezeigt)","aria-label":"Spielername","aria-describedby":"nameLabel",onChange:function(e){i(String(e.target.value))}}),Object(r.jsx)(y.a.Append,{children:Object(r.jsx)(S.a,{variant:"success",onClick:function(){return k.emit("name",n)},children:"\xdcbernehmen"})})]})},C=n(25),N=n(7);function D(e){var t=e.statistics;return t&&t.yesAnswers+t.noAnswers>0?Object(r.jsx)(N.a,{children:Object(r.jsxs)(N.a.Body,{children:[Object(r.jsx)(N.a.Title,{children:"Antworten deiner MitspielerInnen:"}),Object(r.jsxs)(N.a.Text,{children:[t.percentage,'% der andrenas haben auf diese Frage mit "Ja" geantwortet']})]})}):null}var B=n(28);function I(e){var t=e.question,n=e.answer;if(!n||"yes"!==n.answer&&"no"!==n.answer){if(t.isActive){var c=function(e){return function(){return k.emit("answer",{id:t.id,answer:e})}};return Object(r.jsxs)("p",{children:["Und? Hast du?: ",Object(r.jsx)(S.a,{variant:"primary",onClick:c("yes"),children:"Ja"}),Object(r.jsx)(S.a,{variant:"primary",onClick:c("no"),children:"Nein"})]})}return Object(r.jsx)("p",{children:"Du hast auf diese Frage nicht geantwortet."})}return Object(r.jsxs)("p",{children:['Du hast "',"yes"===n.answer?"Ja":"Nein",'" geantwortet.']})}function T(e){var t=e.question,n=e.answer,i=Object(c.useState)(50),a=Object(p.a)(i,2),s=a[0],j=a[1];if(n&&n.estimate)return Object(r.jsxs)("p",{children:["Du hast gesch\xe4tzt, dass ",n.estimate,'% der MitspielerInnen "Ja" geantwortet haben.']});if(t.isActive){return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(B.a,{children:Object(r.jsxs)(B.a.Group,{controlId:"formBasicRange",children:[Object(r.jsx)(B.a.Label,{children:'Was sch\xe4tzst du, wie viele % der Teilnehmer haben mit "Ja" geantwortet?'}),Object(r.jsx)(B.a.Control,{type:"range",onChange:function(e){j(Number(e.target.value))},custom:!0})]})}),Object(r.jsxs)(S.a,{variant:"primary",onClick:function(){return k.emit("estimate",{id:t.id,estimate:s})},children:["Sch\xe4tzung abgeben (",s,"%)"]})]})}return Object(r.jsx)("p",{children:"Du hast f\xfcr diese Frage keine Sch\xe4tzung abgegeben."})}function J(e){var t=e.question,n=e.answer;return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("style",{type:"text/css",children:"\n      .btn-primary {\n        margin: 0.1em;\n      }\n      "}),Object(r.jsx)(N.a,{children:Object(r.jsxs)(N.a.Body,{children:[Object(r.jsx)(N.a.Title,{children:"Deine Antworten:"}),Object(r.jsx)(I,{question:t,answer:n}),Object(r.jsx)(T,{question:t,answer:n})]})})]})}var L=function(e){var t=e.question,n=e.answer,c=e.statistics;return Object(r.jsxs)(N.a,{children:[Object(r.jsx)("style",{type:"text/css",children:"\n      .accordion .card-header .btn-link {\n        font-weight: bold;\n        font-size: 1.3em;\n        text-align: left;\n      }\n      "}),Object(r.jsx)(N.a.Header,{children:Object(r.jsx)(C.a.Toggle,{as:S.a,variant:t.isActive?"link":"button",eventKey:String(t.id),children:(t.isActive?"Aktulle Frage: ":"")+t.question})}),Object(r.jsx)(C.a.Collapse,{eventKey:String(t.id),children:Object(r.jsxs)(N.a.Body,{children:[Object(r.jsx)(J,{question:t,answer:n}),Object(r.jsx)("br",{}),Object(r.jsx)(D,{statistics:c})]})})]})};var P=function(){var e=Object(c.useState)([]),t=Object(p.a)(e,2),n=t[0],i=t[1],a=Object(c.useState)([]),s=Object(p.a)(a,2),j=s[0],o=s[1],u=Object(c.useState)([]),d=Object(p.a)(u,2),b=d[0],l=d[1],h=Object(c.useState)("0"),O=Object(p.a)(h,2),x=O[0],f=O[1];return z("questions",(function(e){e.reverse(),i(e);var t=e.find((function(e){return e.isActive}));t&&f(String(t.id))})),z("answers",o),z("statistics",l),Object(r.jsx)(C.a,{defaultActiveKey:"0",activeKey:x,onSelect:function(e,t){e&&f(e)},children:n.map((function(e){return Object(r.jsx)(L,{question:e,answer:j[e.id],statistics:b[e.id]},e.id)}))})};var K=function(){var e=Object(c.useState)(!1),t=Object(p.a)(e,2),n=t[0],i=t[1];return z("you are admin",(function(){return i(!0)})),n?Object(r.jsx)(S.a,{variant:"danger",onClick:function(){return k.emit("next question")},children:"N\xe4chste Frage"}):null},H=n(50);function M(e){var t=e.score;return t.id===k.id?Object(r.jsxs)("b",{children:[t.playerName,"(Du): ",t.score]}):Object(r.jsxs)(r.Fragment,{children:[t.playerName,": ",t.score]})}var R=function(){var e=Object(c.useState)([]),t=Object(p.a)(e,2),n=t[0],i=t[1];return z("scores",i),Object(r.jsxs)(N.a,{children:[Object(r.jsx)(N.a.Header,{children:"Beste Sch\xe4tzer:"}),Object(r.jsx)(H.a,{variant:"flush",children:n.map((function(e){return Object(r.jsx)(H.a.Item,{children:Object(r.jsx)(M,{score:e})},e.playerName)}))}),Object(r.jsx)(N.a.Footer,{className:"text-muted",children:"Score: Summe der Differenzen der Andrena-Antworten zu der eigenen Sch\xe4tzung. D.h. kleiner ist besser ;)"})]})};var E=function(){return Object(r.jsxs)(j.a,{className:"App",children:[Object(r.jsx)(o.a,{children:Object(r.jsx)(u.a,{children:Object(r.jsx)(m,{})})}),Object(r.jsx)(o.a,{children:Object(r.jsx)(u.a,{children:Object(r.jsx)(q,{})})}),Object(r.jsx)(o.a,{children:Object(r.jsx)(u.a,{children:Object(r.jsx)(K,{})})}),Object(r.jsxs)(o.a,{children:[Object(r.jsx)(u.a,{sm:8,children:Object(r.jsx)(P,{})}),Object(r.jsx)(u.a,{sm:4,children:Object(r.jsx)(R,{})})]})]})},W=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,120)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,i=t.getLCP,a=t.getTTFB;n(e),r(e),c(e),i(e),a(e)}))};n(117);s.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(E,{})}),document.getElementById("root")),W()},78:function(e,t,n){},79:function(e,t,n){}},[[118,1,2]]]);
//# sourceMappingURL=main.2a270628.chunk.js.map