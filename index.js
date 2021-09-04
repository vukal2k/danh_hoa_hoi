const axios = require('axios');
var crypto = require("crypto");

const token = 'garticio=s%3Abd83eab5-751e-45df-8c8b-34f14ad109a5.KEGYCFMB%2FOlImPw32LbA68GCgKCd5p8uPuX%2BlW%2BDLd0; __cf_bm=EfbdWqGm5J52Oko0yZP84PtgrM1T29vJvzIIKRi5eh0-1630766542-0-AbKUcCbNozWN63A7DdLxlRO+rlKmiiBS4I2/YpmW0VwQDo8V5pChW+P1KTTIaWzgGqMicBmOz4PRpXzkICfB9NI=; pg_analytics=disabled; pg_mm2_cookie_a=21f21584-270a-45bd-967c-a71b882c100c; pg_session_id=674c1cf0-7052-4897-b381-dbb0a14ec581; pg_tc=sample; pg_pl=13; pg_quick_check=true; pg_ua=Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36; pg_beacon=1; _gid=GA1.2.1305567673.1630766544; pg_geo={"country":"VN","region":"HN","ip":"123.24.6.101"}; pg_custom_timeout=; pg_ip=123.24.6.101; pg_bot_reason=lnb; pg_bot_percent=0; pg_bot_model=1; pg_height=1080; pg_width=1920; pg_aheight=1040; pg_awidth=1920; pg_last_unload=8943; pg_pv_time_1=8943; pg_mouse_move=214; pg_keypress=0; pg_click=2; pg_touch_move=0; pg_scroll=0; pg_touch_start=0; pg_session_depth=2; pg_latency_before_tc=96; pg_canonical_session=fa08fdd6562ea53a4a9e01a962cc2a01; _ga=GA1.2.470788309.1630766544; __gads=ID=183721a98ce530d3:T=1630766544:S=ALNI_MaNqVp56vesSw41ro7tGXKGYyxyvQ; pg_tc_response_time=2078; _ga_VR1WBQ9P5N=GS1.1.1630766543.1.1.1630766838.0; pg_pv_time_2=70075';


const getListRemoveWord = async (listRemove) => {
    if(listRemove){
        return listRemove;
    }
    let result = await axios.get('https://gartic.io/req/subject?subject=30&language=13', {
        headers:{
            cookie: token
        }
    });

    return result.data.map(el => el[0]);
}

const getTotalWorldLength = async ()=>{
    const response = await axios.get(`https://wold.clld.org/values?contribution=24&sEcho=3&iColumns=6&sColumns=word_form%2Clwt_code%2Cmeaning%2Ccore_list%2Cborrowed%2Csource_words&iDisplayStart=100&iDisplayLength=100&mDataProp_0=0&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=1&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=2&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=3&sSearch_3=True&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=4&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=5&sSearch_5=&bRegex_5=false&bSearchable_5=false&bSortable_5=false&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&__eid__=Counterparts&_=1630168163180`
    , {
        headers:{
        'X-Requested-With': 'XMLHttpRequest'
        }
    });

    return response.data.iTotalRecords;
}


const getListTiengVietWord = async()=>{
    let result = [];
    const totalRecord = await getTotalWorldLength();

    const response = await axios.get(`https://wold.clld.org/values?contribution=24&sEcho=3&iColumns=6&sColumns=word_form%2Clwt_code%2Cmeaning%2Ccore_list%2Cborrowed%2Csource_words&iDisplayStart=0&iDisplayLength=${totalRecord}&mDataProp_0=0&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=1&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=2&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=3&sSearch_3=True&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=4&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=5&sSearch_5=&bRegex_5=false&bSearchable_5=false&bSortable_5=false&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&__eid__=Counterparts&_=1630168163180`
    , {
        headers:{
        'X-Requested-With': 'XMLHttpRequest'
        }
    });
    result = [...new Set(response.data.aaData.map(el =>{
        return el[0].replace(/(<([^>]+)>)/gi, "").split(' (')[0];
    }).filter(el => el.split(' ').length<=3))];


    //Random

    return result.map(el => [el, "0"]);
}

const updateData = async(added, removed)=>{
    const body = {
        language: 13,
        subject: "30",
        added,
        removed,
    }
    const result = await axios.post('https://gartic.io/req/editSubject', body, {
        headers:{
            cookie: token
        }
    })

    return result.data;
}

const main = async()=>{
    //1. Sync list
    let removed = await getListRemoveWord();
    let added = await getListTiengVietWord();
    let updateStatus = await updateData(added, removed);

    //2. Remove list unused
    removed = ['ồ','sự làm rỗng','sự sưng lên','tắt','gạch sống','xà neo','trầm','ép','keo kiệt'];
    added = [];
    updateStatus = await updateData(added, removed);

    console.log(updateStatus)
};
main();
