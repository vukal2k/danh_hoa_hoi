const axios = require('axios');
var crypto = require("crypto");

const token = 'CountryCode=VN; userFromEEA=false; __gads=ID=8c2ddb028ad9cfe2:T=1629900959:S=ALNI_MYWvUBDVwRrGoaGQCDuiyvKIL2gqQ; garticio=s%3A59530c12-7238-400e-8681-7279f46bb351.%2FgWeWX8PienhfAj2fNSKCQdrZFiRYe1sUJUTWLbGWEE; _gid=GA1.2.139362625.1630156359; __cf_bm=e811201f856bad680e454c3e011251169a0e496c-1630163381-1800-Afzdj6Ix2CbxgV9nvdL+YmYMV/7hntpCQyrUk/6vka/0P9UfjB9wbz+UlPHRlWdyOPxgpEue2wTJaBZC/l5VhyQ=; _gat_gtag_UA_3906902_31=1; _ga=GA1.2.230272424.1629900957; session_depth=gartic.io%3D13%7C772647598%3D13; _ga_VR1WBQ9P5N=GS1.1.1630159640.4.1.1630163426.0';


const getListRemoveWord = async () => {
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
    const removed = await getListRemoveWord();
    let added = await getListTiengVietWord();
    const updateStatus = await updateData(added, removed);

    console.log(updateStatus)
};
main();
