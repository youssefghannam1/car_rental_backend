import{j as e,B as h,T as _,r as o,t as W,w as S,A as q,I as F,k as P,P as M,M as B,m as D,l as R,x as N,y as U,z,p as L,S as $,H}from"./index-B7Wsk78G.js";import{C as J}from"./config-global-D2nuHm2Z.js";import{T as w,a as y,f as k,L as I,A,b as V,c as Y,v as G,d as Q,e as K,g as X,h as Z,i as ee,j as ae,k as re}from"./TableSortLabel-CCSiYQXV.js";import{T as b,a as T,O as te}from"./TextField-N_FfcRIq.js";import{L as se}from"./label-BebbXxD2.js";import{a as E,C as oe}from"./Checkbox-BTnauqvw.js";function ne({searchQuery:n,...t}){return e.jsx(w,{...t,children:e.jsx(y,{align:"center",colSpan:7,children:e.jsxs(h,{sx:{py:15,textAlign:"center"},children:[e.jsx(_,{variant:"h6",sx:{mb:1},children:"Not found"}),e.jsxs(_,{variant:"body2",children:["No results found for  ",e.jsxs("strong",{children:['"',n,'"']}),".",e.jsx("br",{})," Try checking for typos or using complete words."]})]})})})}const le={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:500,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4};function ie({setCars:n,editingCar:t,setEditingCar:d,setOpen:l,open:g}){const[i,u]=o.useState({model:"",brand:"",year:"",price_per_day:0,matricule:"",category:"",status:""}),[r,j]=o.useState({matricule:"",model:"",brand:"",year:"",price_per_day:0,category:"",status:""});o.useEffect(()=>{u({model:t.model,brand:t.brand,year:t.year,price_per_day:t.price_per_day,matricule:t.matricule,category:t.category,status:t.status})},[t]);const[v,c]=o.useState(!1),x=()=>{l(!1)},p=a=>{const{name:f,value:s}=a.target;u(C=>({...C,[f]:s}))};o.useEffect(()=>{const a=Object.values(i).some(f=>f==="");c(a)},[i]);const m=async a=>{a.preventDefault();const f=new FormData;Object.entries(i).forEach(([s,C])=>{f.append(s,C.toString())});try{await T.put(`http://localhost:8000/api/cars/${t.id}`,f,{headers:{"Content-Type":"application/json"}}),l(!1),u({model:"",brand:"",year:"",price_per_day:0,matricule:"",category:"",status:""}),await k(n)}catch(s){s.response&&s.response.data&&s.response.data.errors?j({model:s.response.data.errors.model?s.response.data.errors.model[0]:"",brand:s.response.data.errors.brand?s.response.data.errors.brand[0]:"",year:s.response.data.errors.year?s.response.data.errors.year[0]:"",price_per_day:s.response.data.errors.price_per_day?s.response.data.errors.price_per_day[0]:"",matricule:s.response.data.errors.matricule?s.response.data.errors.matricule[0]:"",category:s.response.data.errors.category?s.response.data.errors.category[0]:"",status:s.response.data.errors.status?s.response.data.errors.status[0]:""}):console.error("Unexpected error:",s)}};return e.jsx(W,{open:g,onClose:x,"aria-labelledby":"modal-title","aria-describedby":"modal-description",children:e.jsxs(h,{sx:le,component:"form",children:[e.jsx(_,{id:"modal-modal-title",variant:"h6",component:"h2",gutterBottom:!0,children:"Modifiez une Voiture"}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Model",variant:"outlined",name:"model",fullWidth:!0,value:i.model,onChange:p,required:!0}),e.jsx(b,{label:"Brand",variant:"outlined",name:"brand",fullWidth:!0,value:i.brand,onChange:p,required:!0})]}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Matricule",variant:"outlined",name:"matricule",fullWidth:!0,error:!!r.matricule,value:i.matricule,onChange:p,required:!0,helperText:r.matricule?r.matricule:""}),e.jsx(b,{label:"Year",variant:"outlined",name:"year",fullWidth:!0,value:i.year,onChange:p,required:!0})]}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Category",variant:"outlined",name:"category",fullWidth:!0,value:i.category,onChange:p,required:!0}),e.jsx(b,{label:"Status",variant:"outlined",name:"status",fullWidth:!0,value:i.status,onChange:p,required:!0})]}),e.jsx(h,{display:"flex",gap:2,mb:2,children:e.jsx(b,{label:"Prix par Jour",variant:"outlined",name:"price_per_day",fullWidth:!0,value:i.price_per_day,onChange:p,required:!0})}),e.jsxs(h,{display:"flex",justifyContent:"space-between",mt:3,children:[e.jsx(S,{variant:"outlined",onClick:x,children:"Retour"}),e.jsx(S,{type:"submit",onClick:m,variant:"contained",disabled:v,color:"primary",children:"Modifiez"})]})]})})}function de({setCars:n,row:t,selected:d,onSelectRow:l}){const[g,i]=o.useState(null),[u,r]=o.useState({id:"",model:"",brand:"",year:"",price_per_day:0,matricule:"",category:"",status:"",avatarUrl:""}),[j,v]=o.useState(!1),c=o.useCallback(a=>{i(a.currentTarget)},[]),x=o.useCallback(()=>{i(null)},[]),p=async a=>{i(null),await T.delete(`http://localhost:8000/api/cars/${a}`),await k(n)},m=a=>{v(!0),r({id:a==null?void 0:a.id,model:a==null?void 0:a.model,brand:a==null?void 0:a.brand,year:a==null?void 0:a.year,price_per_day:a==null?void 0:a.price_per_day,matricule:a==null?void 0:a.matricule,category:a==null?void 0:a.category,status:a==null?void 0:a.status,avatarUrl:a==null?void 0:a.avatarUrl})};return e.jsxs(e.Fragment,{children:[e.jsxs(w,{hover:!0,tabIndex:-1,role:"checkbox",selected:d,children:[e.jsx(y,{padding:"checkbox",children:e.jsx(E,{disableRipple:!0,checked:d,onChange:l})}),e.jsx(y,{component:"th",scope:"row",children:e.jsxs(h,{gap:2,display:"flex",alignItems:"center",children:[e.jsx(q,{alt:t.model,src:t.avatarUrl}),t.model]})}),e.jsx(y,{children:t.brand}),e.jsx(y,{children:t.year}),e.jsx(y,{children:t.matricule}),e.jsx(y,{children:t.category}),e.jsx(y,{children:t.price_per_day}),e.jsx(y,{children:e.jsx(se,{color:t.status==="Pas Disponible"&&"error"||"success",children:t.status})}),e.jsx(y,{align:"right",children:e.jsx(F,{onClick:c,children:e.jsx(P,{icon:"eva:more-vertical-fill"})})})]}),e.jsx(M,{open:!!g,anchorEl:g,onClose:x,anchorOrigin:{vertical:"top",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"right"},children:e.jsxs(B,{disablePadding:!0,sx:{p:.5,gap:.5,width:140,display:"flex",flexDirection:"column",[`& .${D.root}`]:{px:1,gap:2,borderRadius:.75,[`&.${D.selected}`]:{bgcolor:"action.selected"}}},children:[e.jsxs(R,{onClick:()=>m(t),children:[e.jsx(P,{icon:"solar:pen-bold"}),"Modifier"]}),e.jsx(I,{dateAdapter:A,children:e.jsx(ie,{setCars:n,setEditingCar:r,editingCar:u,setOpen:v,open:j})}),e.jsxs(R,{onClick:()=>p(t.id),sx:{color:"error.main"},children:[e.jsx(P,{icon:"solar:trash-bin-trash-bold"}),"Delete"]})]})})]})}function ce({order:n,onSort:t,orderBy:d,rowCount:l,headLabel:g,numSelected:i,onSelectAllRows:u}){return e.jsx(V,{children:e.jsxs(w,{children:[e.jsx(y,{padding:"checkbox",children:e.jsx(E,{indeterminate:i>0&&i<l,checked:l>0&&i===l,onChange:r=>u(r.target.checked)})}),g.map(r=>e.jsx(y,{align:r.align||"left",sortDirection:d===r.id?n:!1,sx:{width:r.width,minWidth:r.minWidth},children:e.jsxs(Y,{hideSortIcon:!0,active:d===r.id,direction:d===r.id?n:"asc",onClick:()=>t(r.id),children:[r.label,d===r.id?e.jsx(h,{sx:{...G},children:n==="desc"?"sorted descending":"sorted ascending"}):null]})},r.id))]})})}function ue({emptyRows:n,height:t,sx:d,...l}){return n?e.jsx(w,{sx:{...t&&{height:t*n},...d},...l,children:e.jsx(y,{colSpan:9})}):null}function pe({numSelected:n,filterName:t,onFilterName:d}){return e.jsxs(N,{sx:{height:96,display:"flex",justifyContent:"space-between",p:l=>l.spacing(0,1,0,3),...n>0&&{color:"primary.main",bgcolor:"primary.lighter"}},children:[n>0?e.jsxs(_,{component:"div",variant:"subtitle1",children:[n," selected"]}):e.jsx(te,{fullWidth:!0,value:t,onChange:d,placeholder:"Search car...",startAdornment:e.jsx(U,{position:"start",children:e.jsx(P,{width:20,icon:"eva:search-fill",sx:{color:"text.disabled"}})}),sx:{maxWidth:320}}),n>0?e.jsx(z,{title:"Delete",children:e.jsx(F,{children:e.jsx(P,{icon:"solar:trash-bin-trash-bold"})})}):e.jsx(e.Fragment,{children:e.jsx(S,{variant:"contained",color:"success",startIcon:e.jsx(P,{icon:"vscode-icons:file-type-excel2"}),children:"Export"})})]})}const he={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:500,bgcolor:"background.paper",border:"2px solid #000",boxShadow:24,p:4};function xe({setCars:n,setOpen:t,open:d}){const[l,g]=o.useState({model:"",brand:"",year:"",price_per_day:0,matricule:"",category:"",status:""}),[i,u]=o.useState({matricule:"",model:"",brand:"",year:"",price_per_day:0,category:"",status:""}),[r,j]=o.useState(!1),v=()=>{t(!1)},c=p=>{const{name:m,value:a}=p.target;g(f=>({...f,[m]:a}))};o.useEffect(()=>{const p=Object.values(l).some(m=>m==="");j(p)},[l]);const x=async p=>{p.preventDefault();const m=new FormData;Object.entries(l).forEach(([a,f])=>{m.append(a,f.toString())});try{await T.post("http://localhost:8000/api/cars",m),t(!1),g({model:"",brand:"",year:"",price_per_day:0,matricule:"",category:"",status:""}),await k(n)}catch(a){a.response&&a.response.data&&a.response.data.errors?u({model:a.response.data.errors.model?a.response.data.errors.model[0]:"",brand:a.response.data.errors.brand?a.response.data.errors.brand[0]:"",year:a.response.data.errors.year?a.response.data.errors.year[0]:"",price_per_day:a.response.data.errors.price_per_day?a.response.data.errors.price_per_day[0]:"",matricule:a.response.data.errors.matricule?a.response.data.errors.matricule[0]:"",category:a.response.data.errors.category?a.response.data.errors.category[0]:"",status:a.response.data.errors.status?a.response.data.errors.status[0]:""}):console.error("Unexpected error:",a)}};return e.jsx(W,{open:d,onClose:v,"aria-labelledby":"modal-title","aria-describedby":"modal-description",children:e.jsxs(h,{sx:he,component:"form",onSubmit:x,children:[e.jsx(_,{id:"modal-modal-title",variant:"h6",component:"h2",gutterBottom:!0,children:"Ajoutez une Voiture"}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Model",variant:"outlined",name:"model",fullWidth:!0,value:l.model,onChange:c,required:!0}),e.jsx(b,{label:"Brand",variant:"outlined",name:"brand",fullWidth:!0,value:l.brand,onChange:c,required:!0})]}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Matricule",variant:"outlined",name:"matricule",fullWidth:!0,error:!!i.matricule,value:l.matricule,onChange:c,helperText:i.matricule?i.matricule:"",required:!0}),e.jsx(b,{label:"Disponsibilité",variant:"outlined",name:"status",fullWidth:!0,value:l.status,onChange:c,required:!0})]}),e.jsxs(h,{display:"flex",gap:2,mb:2,children:[e.jsx(b,{label:"Year",variant:"outlined",name:"year",fullWidth:!0,value:l.year,onChange:c,required:!0}),e.jsx(b,{label:"Prix par Jour",variant:"outlined",name:"price_per_day",fullWidth:!0,value:l.price_per_day,onChange:c,required:!0})]}),e.jsx(h,{display:"flex",gap:2,mb:2,children:e.jsx(b,{label:"Categorie",variant:"outlined",name:"category",fullWidth:!0,value:l.category,onChange:c,required:!0})}),e.jsxs(h,{display:"flex",justifyContent:"space-between",mt:3,children:[e.jsx(S,{variant:"outlined",onClick:v,children:"Retour"}),e.jsx(S,{type:"submit",onClick:x,variant:"contained",disabled:r,color:"primary",children:"Ajouter"})]})]})})}function me(){const[n,t]=o.useState([]),[d,l]=o.useState(""),[g,i]=o.useState(!1),u=()=>i(!0);o.useEffect(()=>{(async()=>{const x=localStorage.getItem("cars");x?t(JSON.parse(x)):await k(t)})()},[]);const r=be(),j=Q({inputData:n,comparator:re(r.order,r.orderBy),filterName:d}),v=!j.length&&!!d;return e.jsxs(L,{children:[e.jsxs(h,{display:"flex",alignItems:"center",mb:5,children:[e.jsx(_,{variant:"h4",flexGrow:1,children:"Véhicules"}),e.jsx(S,{variant:"contained",color:"inherit",onClick:u,startIcon:e.jsx(P,{icon:"mingcute:add-line"}),children:"Nouveau Voiture"}),e.jsx(I,{dateAdapter:A,children:e.jsx(xe,{setCars:t,setOpen:i,open:g})})]}),e.jsxs(oe,{children:[e.jsx(pe,{numSelected:r.selected.length,filterName:d,onFilterName:c=>{l(c.target.value),r.onResetPage()}}),e.jsx($,{children:e.jsx(K,{sx:{overflow:"unset"},children:e.jsxs(X,{sx:{minWidth:800},children:[e.jsx(ce,{order:r.order,orderBy:r.orderBy,rowCount:n.length,numSelected:r.selected.length,onSort:r.onSort,onSelectAllRows:c=>r.onSelectAllRows(c,n.map(x=>x.id)),headLabel:[{id:"model",label:"Model"},{id:"brand",label:"Brand"},{id:"year",label:"Year"},{id:"matricule",label:"Matricule"},{id:"category",label:"Category"},{id:"prix",label:"Prix Par Jour"},{id:"status",label:"Status"},{id:"action",label:"Action"}]}),e.jsxs(Z,{children:[j.slice(r.page*r.rowsPerPage,r.page*r.rowsPerPage+r.rowsPerPage).map(c=>e.jsx(de,{setCars:t,row:c,selected:r.selected.includes(c.id),onSelectRow:()=>r.onSelectRow(c.id)},c.id)),e.jsx(ue,{height:68,emptyRows:ee(r.page,r.rowsPerPage,n.length)}),v&&e.jsx(ne,{searchQuery:d})]})]})})}),e.jsx(ae,{component:"div",page:r.page,count:n.length,rowsPerPage:r.rowsPerPage,onPageChange:r.onChangePage,rowsPerPageOptions:[5,10,25],onRowsPerPageChange:r.onChangeRowsPerPage})]})]})}function be(){const[n,t]=o.useState(0),[d,l]=o.useState("name"),[g,i]=o.useState(5),[u,r]=o.useState([]),[j,v]=o.useState("asc"),c=o.useCallback(s=>{v(d===s&&j==="asc"?"desc":"asc"),l(s)},[j,d]),x=o.useCallback((s,C)=>{if(s){r(C);return}r([])},[]),p=o.useCallback(s=>{const C=u.includes(s)?u.filter(O=>O!==s):[...u,s];r(C)},[u]),m=o.useCallback(()=>{t(0)},[]),a=o.useCallback((s,C)=>{t(C)},[]),f=o.useCallback(s=>{i(parseInt(s.target.value,10)),m()},[m]);return{page:n,order:j,onSort:c,orderBy:d,selected:u,rowsPerPage:g,onSelectRow:p,onResetPage:m,onChangePage:a,onSelectAllRows:x,onChangeRowsPerPage:f}}function Pe(){return e.jsxs(e.Fragment,{children:[e.jsx(H,{children:e.jsxs("title",{children:[" ",`Car - ${J.appName}`]})}),e.jsx(me,{})]})}export{Pe as default};
