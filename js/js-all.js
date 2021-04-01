let data = [];
const urlApi = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"

const ticketCardArea = document.querySelector(".ticketCard-area");
const addTicketBtn = document.querySelector(".addTicket-btn"); // 新增套票 Btn
const addTicketForm = document.querySelector(".addTicket-form"); // 新增表單
const searchResultText = document.querySelector("#searchResult-text");// 搜尋
const regionSearch = document.querySelector(".regionSearch"); // 搜尋結果
const dataChart = document.querySelector(".data-Chart"); // 搜尋結果

// 監聽
addTicketBtn.addEventListener("click",AddCart);
regionSearch.addEventListener("change",showSearch);

// let areaDomValue  = regionSearch.value;

let Doms = {
  name : document.querySelector("#ticketName"), // 套票名稱
  imgUrl :document.querySelector("#ticketImgUrl"), // 圖片網址
  area :document.querySelector("#ticketRegion"), // 景點地區
  price :document.querySelector("#ticketPrice"), // 套票金額
  group :document.querySelector("#ticketNum"), // 套票組數
  rate :document.querySelector("#ticketRate"), // 套票星級
  description :document.querySelector("#ticketDescription"), // 套票描述
}

let errorMessages = {
  name: "請填寫 套票名稱",
  imgUrl: "請填寫 圖片網址",
  area: "請填寫 景點地區",
  price: "請填寫 套票金額",
  group: "請填寫 套票組數",
  rate: "請填寫 套票星級",
  description: "請填寫 套票描述",
  rateCheck: "套票星級區間請輸入1-10",
  descriptionCheck: "套票描述不得超過100字"
}

// 初始化頁面
init();

function init() {
  // getData
  axios
  .get(urlApi)
  .then(function (response) {
    data = response.data.data
    showAreaList();
    renderList() // 畫面初始化
    renderC3();
    
  })
  .catch(function (error) {
    console.error(`something wrong! ${error}`);
  });
}

// 新增資料
function AddCart() {
  let formValue = {
      name : Doms.name.value.trim(),
      imgUrl : Doms.imgUrl.value.trim(),
      area : Doms.area.value.trim(),
      price : Number(Doms.price.value),
      group : Number(Doms.group.value),
      rate : Number(Doms.rate.value),
      description : Doms.description.value.trim(),
    }
    if(checkForm(formValue) === true){
      formValue.id = Date.now();
      data.push(formValue);
      addTicketForm.reset();
      renderList();
      renderC3();
    }
}

// 防呆：排除表單錯誤輸入，並針對不同欄位給不同提示
function checkForm(obj) {
  // 檢查 value 是否空白
  for (const key in obj){
    let objValue = obj[key];
    if(!objValue){
      alert(errorMessages[key]);
      return
    } 
  }
  // 檢查星數與字數
  if(obj.rate <=0 || obj.rate > 10){
    alert(errorMessages.rateCheck)  
    return
  }else if(obj.description.length > 100){
    alert(errorMessages.descriptionCheck)
    return
  } 
    return true
}

// 顯示地區下拉列表
function showAreaList(){
  let str = `<option value="" disabled selected hidden>請選擇景點地區</option><option value="全部地區">全部地區</option>`;
  data.forEach((item) => {
    if (item.area === undefined);
    str += `<option value="${item['area']}">${item['area']}</option>`;
  });
  regionSearch.innerHTML = str;
}

// 渲染產品區塊
function renderList(location) {
  let str = "";
  const searchData = data.filter(function (item){
    if(location == item.area){
      return item
    } 
    if(!location) {
      return item
    }
  })
  
  searchData.forEach((item,index)=>{
    str+= `<li class="ticketCard">
    <div class="ticketCard-img">
      <a href="#">
        <img src="${item.imgUrl}" alt="${item.name}" />
      </a>
      <div class="ticketCard-region">${item.area}</div>
      <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
      <div>
        <h3>
          <a href="#" class="ticketCard-name">${item.name}</a>
        </h3>
        <p class="ticketCard-description">
          ${item.description}
        </p>
      </div>
      <div class="ticketCard-info">
        <p class="ticketCard-num">
          <span><i class="fas fa-exclamation-circle"></i></span>
          剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
        </p>
        <p class="ticketCard-price">
          TWD <span id="ticketCard-price">$${item.price}</span>
        </p>
      </div>
    </div>
  </li>`
  })
  ticketCardArea.innerHTML = str;
  searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;
  
}

// 渲染n. 搜尋區塊
function showSearch(e) {
  let area = e.target.value;
  let resultLength = 0;
  data.forEach((item,index, array)=>{
    if(area == "全部地區" || area == "地區搜尋"){
      resultLength = array.length;
      renderList()
    } else if (area == item.area){
      resultLength++;
      renderList(item.area)
    }
  });
  searchResultText.textContent = `本次搜尋共 ${resultLength} 筆資料`;
}

// console.log(data);
function renderC3() {
  const total = {};
  data.forEach((item) => {
    // 如果找不到這個值，就賦予這個物件這個 key 與 value 為 1
    if (total[item.area] == undefined) {
      total[item.area] = 1;
    } else {
      total[item.area] += 1;
    }
  });

  const areaArray = Object.keys(total);
  const newAreaArray = [];
  areaArray.forEach((item) => {
    let arr = [];
    arr.push(item);
    arr.push(total[item]);
    newAreaArray.push(arr);
  });

  let donutChart = c3.generate({
    bindto: '#donutChart',
    data: {
      columns: newAreaArray,
      type: 'donut',
      colors: {
        台北: '#26BFC7',
        台中: '#5151D3',
        高雄: '#E68619',
      },
    },
    donut: {
      title: '地區分佈',
    },
  });
};


// 好範例：https://codepen.io/tomhandgun/pen/mdOvERp?editors=0010
// 助教推的範本： https://codepen.io/tsuifei/pen/MWJyoEB?editors=0011