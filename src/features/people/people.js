/* A role-scoped directory backed by the existing member and staff accounts. */
window.SyncPeople = (() => {
  I18n.extend({
    'People':'人員','Manage everyone at SYNC.':'在同一處管理 SYNC 的所有人員。',
    'Find members and instructors.':'查找會員與指導老師資料。','Add person':'新增人員',
    'All people':'所有人員','Instructors':'指導老師','Admins':'管理員','Person':'人員',
    'People directory':'人員列表','Filter people by role':'依角色篩選人員',
    'Search people':'搜尋人員','Clear search':'清除搜尋','View profile':'查看資料',
    'Back to people':'返回人員列表','Person profile':'人員資料','Account access':'帳戶權限',
    'Created by':'建立人員','Join date unavailable':'尚無加入日期紀錄',
    'Person not available':'無法查看此人員','This profile is unavailable in your workspace.':'此工作台無法查看這份人員資料。',
    'No people found':'找不到符合的人員','Try another name, email or role.':'請嘗試其他姓名、電子郵件或角色。',
    'Clear filters':'清除篩選','Showing {start}–{end} of {total} people':'顯示第 {start}–{end} 位，共 {total} 位人員',
    'Previous page':'上一頁','Next page':'下一頁','Directory pages':'人員列表分頁',
    'Next 7 days':'未來 7 天','Assigned classes':'指派課程','No specializations recorded':'尚無授課項目紀錄',
    'No assigned classes in the next 7 days.':'未來 7 天尚無指派課程。',
    'Showing the next 8 classes.':'顯示接下來的 8 堂課。',
    'Manage accounts in People.':'前往人員列表，管理帳戶與角色資料。','Open People':'開啟人員列表'
  });
  const t=I18n.translate, e=escapeHTML;
  const roles={member:'Member',instructor:'Instructor',frontdesk:'Front desk',admin:'Admin'};
  const filters={member:'Members',instructor:'Instructors',frontdesk:'Front desk',admin:'Admins'};
  const descriptions={
    member:'Book sessions and manage personal passes, rewards and profile.',
    instructor:'View assigned sessions and manage participants and preparation.',
    frontdesk:'Manage bookings, member check-in and guest vouchers.',
    admin:'Manage club operations, accounts, points and passes.'
  };
  const serviceName=s=>t(s==='yoga'?'Yoga':'Contrast Therapy');
  const interpolate=(key,values)=>Object.entries(values).reduce((text,[key,value])=>text.replace('{'+key+'}',String(value)),t(key));
  const profileURL=p=>p.role==='member'?'#admin-members/'+encodeURIComponent(p.id)+'/overview':'#admin-people/'+p.role+'/'+encodeURIComponent(p.id);
  const badge=p=>`<span class="people-role people-role--${p.role}">${t(roles[p.role])}</span>`;
  const dateLabel=value=>{
    const date=value?new Date(value):null;
    return date&&!Number.isNaN(date.getTime())?new Intl.DateTimeFormat(I18n.language,{year:'numeric',month:'short',day:'numeric',timeZone:'Asia/Taipei'}).format(date):null;
  };
  const joined=p=>dateLabel(p.createdAt)?`<time datetime="${e(p.createdAt)}">${e(dateLabel(p.createdAt))}</time>`:`<span class="people-unavailable" title="${t('Join date unavailable')}">—<span class="sr-only">${t('Join date unavailable')}</span></span>`;
  const avatar=p=>{
    const photo=typeof p.photo==='string'&&p.photo.length<150000&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.photo)?p.photo:null;
    const initials=String(p.name).trim().split(/\s+/).map(n=>n[0]||'').slice(0,2).join('').toUpperCase();
    return `<span class="people-avatar people-avatar--${p.role}" aria-hidden="true">${photo?`<img src="${photo}" alt="" width="42" height="42" loading="lazy">`:e(initials)}</span>`;
  };
  function create(api){
    let identity=null,query='',role='all',pageNumber=1;
    const pageSize=12;
    function scope(){
      const next=api.scope();
      if(next!==identity){identity=next;query='';role='all';pageNumber=1}
      return !!next;
    }
    const allowedRoles=()=>api.isAdmin()?Object.keys(roles):['member','instructor'];
    function people(){return scope()?api.accounts().filter(p=>allowedRoles().includes(p.role)):[]}
    function classes(id){return api.sessions(id).filter(s=>!s.cancelled&&s.date>=addDays(0)&&s.date<=addDays(6)&&sessionStart(s.date,s.time)+3600000>Date.now()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))}
    function personCell(p){return `<a class="people-person" href="${profileURL(p)}" data-staff-nav>${avatar(p)}<span><strong>${e(p.name)}</strong><small>${e(p.email)}</small></span></a>`}
    function row(p){
      const values=role==='member'?[`<span class="staff-tier ${String(p.tier).toLowerCase()}">${e(p.tier)}</span>`,money(p.points),money(p.passes)]
        :role==='instructor'?[(p.services||[]).map(serviceName).join(' · ')||t('No specializations recorded'),String(classes(p.id).length)]
        :[badge(p),joined(p)];
      const labels=role==='member'?['Tier','Points','Passes']:role==='instructor'?['Specializations','Next 7 days']:['Account role','Joined'];
      return `<tr role="row"><td role="cell">${personCell(p)}</td>${values.map((value,i)=>`<td role="cell" data-label="${t(labels[i])}">${value}</td>`).join('')}<td role="cell"><a class="people-profile-link" href="${profileURL(p)}" data-staff-nav aria-label="${t('View profile')}: ${e(p.name)}"><span>${t('View profile')}</span><span aria-hidden="true">↗</span></a></td></tr>`;
    }
    function results(){
      const list=people().filter(p=>(role==='all'||p.role===role)&&(p.name+' '+p.email).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name,I18n.language));
      const pages=Math.max(1,Math.ceil(list.length/pageSize));pageNumber=Math.min(pageNumber,pages);
      const start=(pageNumber-1)*pageSize,shown=list.slice(start,start+pageSize);
      const summary=interpolate('Showing {start}–{end} of {total} people',{start:list.length?start+1:0,end:start+shown.length,total:list.length});
      const columns=role==='member'?['Person','Tier','Points','Passes','Action']:role==='instructor'?['Person','Specializations','Next 7 days','Action']:['Person','Account role','Joined','Action'];
      return `<div class="people-results-heading"><p role="status" aria-live="polite">${summary}</p>${role==='instructor'?`<span>${t('Assigned classes')}</span>`:''}</div>${shown.length?`<table class="people-table people-table--${role}" role="table" aria-label="${t('People directory')}"><thead role="rowgroup"><tr role="row">${columns.map(c=>`<th scope="col" role="columnheader">${t(c)}</th>`).join('')}</tr></thead><tbody role="rowgroup">${shown.map(row).join('')}</tbody></table>`:`<div class="people-empty"><span aria-hidden="true">${api.icon('members')}</span><h2>${t('No people found')}</h2><p>${t('Try another name, email or role.')}</p><button data-people="clear">${t('Clear filters')}</button></div>`}${pages>1?`<nav class="people-pagination" aria-label="${t('Directory pages')}"><button data-people="previous" ${pageNumber===1?'disabled':''} aria-label="${t('Previous page')}">←</button><span>${pageNumber} / ${pages}</span><button data-people="next" ${pageNumber===pages?'disabled':''} aria-label="${t('Next page')}">→</button></nav>`:''}`;
    }
    function directory(){
      const list=people();if(!allowedRoles().includes(role))role='all';
      const tabs=['all',...allowedRoles()];
      return `<section class="people-directory" aria-label="${t('People directory')}"><div class="people-toolbar"><label class="people-search"><span class="sr-only">${t('Search people')}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input id="people-search" type="search" autocomplete="off" placeholder="${t('Search by name or email')}" value="${e(query)}" aria-controls="people-results"></label>${api.isAdmin()?`<button class="button people-add" data-staff-tool="create-account" data-role="${role==='all'?'member':role}"><span aria-hidden="true">+</span> ${t('Add person')}</button>`:''}</div><div class="people-filters" role="group" aria-label="${t('Filter people by role')}">${tabs.map(id=>`<button data-people="filter" data-role="${id}" aria-pressed="${role===id}"><span>${t(id==='all'?'All people':filters[id])}</span><span class="people-count">${list.filter(p=>id==='all'||p.role===id).length}</span></button>`).join('')}</div><div id="people-results">${results()}</div></section>`;
    }
    function profile(parts){
      let id;try{id=decodeURIComponent(parts[2]||'')}catch{}
      const p=parts.length===3&&people().find(p=>p.role===parts[1]&&p.id===id&&p.role!=='member');
      const back=`<a class="people-back" href="#admin-people" data-staff-nav>← ${t('Back to people')}</a>`;
      if(!p)return `${back}<section class="people-profile-panel people-empty"><h2>${t('Person not available')}</h2><p>${t('This profile is unavailable in your workspace.')}</p></section>`;
      const field=(label,value)=>`<div><dt>${t(label)}</dt><dd>${value||t('Unavailable')}</dd></div>`;
      const assigned=p.role==='instructor'?classes(p.id):[];
      return `<article class="people-profile">${back}<section class="people-profile-identity">${avatar(p)}<div><h2>${e(p.name)}</h2><p>${e(p.email)}</p></div>${badge(p)}</section><div class="people-profile-grid"><section class="people-profile-panel"><h3>${t('Profile information')}</h3><dl>${field('Full name',e(p.name))}${field('Email address',e(p.email))}${api.isAdmin()?field('Phone number',e(p.phone||'')):''}${field('Joined',dateLabel(p.createdAt)?joined(p):'')}${api.isAdmin()?field('Created by',e(p.createdBy||'')):''}</dl></section><section class="people-profile-panel"><h3>${t(p.role==='instructor'?'Specializations':'Account access')}</h3>${badge(p)}<p class="people-access-description">${t(descriptions[p.role])}</p>${p.role==='instructor'?`<div class="people-service-tags">${(p.services||[]).map(s=>`<span>${serviceName(s)}</span>`).join('')||t('No specializations recorded')}</div>`:''}${api.isAdmin()?`<p class="people-account-source">${t(p.sample?'Sample account':'Created account')}</p>`:''}</section></div>${p.role==='instructor'?`<section class="people-profile-panel people-classes"><div class="people-classes-heading"><div><h3>${t('Assigned classes')}</h3><p>${t('Next 7 days')} · ${assigned.length}</p></div><a href="#admin-schedule" data-staff-nav data-people-schedule="${assigned[0]?.date||addDays(0)}">${t('View schedule')} ↗</a></div>${assigned.length?assigned.slice(0,8).map(s=>`<a class="people-class" href="#admin-schedule" data-staff-nav data-people-schedule="${e(s.date)}"><time>${e(dateLabel(s.date+'T00:00:00+08:00'))}<strong>${e(s.time)}</strong></time><span><strong>${e(t(s.title))}</strong><small>${serviceName(s.service)}${s.room?' · '+e(s.room):''}</small></span><span aria-hidden="true">↗</span></a>`).join(''):`<p class="people-profile-empty">${t('No assigned classes in the next 7 days.')}</p>`}${assigned.length>8?`<p class="people-profile-empty">${t('Showing the next 8 classes.')}</p>`:''}</section>`:''}</article>`;
    }
    function page(hash){if(!scope())return '';return hash.split('/').length>1?profile(hash.split('/')):directory()}
    function refresh(){
      const target=document.querySelector('#people-results');if(!target||!scope())return;
      target.innerHTML=results();
    }
    document.addEventListener('input',event=>{
      if(event.target.id!=='people-search'||!scope())return;
      query=event.target.value;pageNumber=1;refresh();
    });
    document.addEventListener('click',event=>{
      const schedule=event.target.closest('[data-people-schedule]');
      if(schedule&&scope())api.scheduleDate(schedule.dataset.peopleSchedule);
      const button=event.target.closest('[data-people]');if(!button||!scope()||!document.querySelector('.people-directory'))return;
      const action=button.dataset.people;
      if(action==='filter'){
        if(button.dataset.role!=='all'&&!allowedRoles().includes(button.dataset.role))return;
        role=button.dataset.role;pageNumber=1;
        document.querySelectorAll('[data-people=filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===role)));
        const add=document.querySelector('.people-add');if(add)add.dataset.role=role==='all'?'member':role;
      }
      if(action==='clear'){query='';role='all';pageNumber=1;api.render();document.querySelector('#people-search')?.focus();return}
      if(action==='previous')pageNumber=Math.max(1,pageNumber-1);
      if(action==='next')pageNumber++;
      refresh();
      if(action==='previous'||action==='next'){
        const heading=document.querySelector('.people-results-heading');heading.tabIndex=-1;heading.focus({preventScroll:true});
      }
    });
    return {page};
  }
  return {create};
})();
