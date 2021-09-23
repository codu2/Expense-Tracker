const balanceEl = document.querySelector('.balance .value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');
const chartEl = document.querySelector('.chart');

const allBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const outcomeBtn = document.querySelector('.tab3');
const allEl = document.querySelector('#all');
const incomeEl = document.querySelector('#income');
const outcomeEl = document.querySelector('#outcome');
const allList = document.querySelector('#all .list');
const incomeList = document.querySelector('#income .list');
const outcomeList = document.querySelector('#outcome .list');

const addIncome = document.querySelector('.add-income');
const cancelIncome = document.querySelector('.cancel-income');
const incomeTitle = document.getElementById('income-title-input');
const incomeAmount = document.getElementById('income-amount-input');
const addOutcome = document.querySelector('.add-outcome');
const cancelOutcome = document.querySelector('.cancel-outcome');
const outcomeTitle = document.getElementById('outcome-title-input');
const outcomeAmount = document.getElementById('outcome-amount-input');

let ENTRY_LIST = [];
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list"));
updateUI();

allBtn.addEventListener('click', () => {
    active(allBtn);
    inactive([incomeBtn, outcomeBtn]);
    show(allEl);
    hide([incomeEl, outcomeEl]);
})

incomeBtn.addEventListener('click', () => {
    active(incomeBtn);
    inactive([allBtn, outcomeBtn]);
    show(incomeEl);
    hide([allEl, outcomeEl]);
})

outcomeBtn.addEventListener('click', () => {
    active(outcomeBtn);
    inactive([allBtn, incomeBtn]);
    show(outcomeEl);
    hide([allEl, incomeEl]);
})

addIncome.addEventListener('click', () => {
    if(!incomeTitle.value || !incomeAmount.value) return;

    let income = {
        type : 'income',
        title : incomeTitle.value,
        amount : parseFloat(incomeAmount.value),
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput([incomeTitle, incomeAmount]);
    /*
    if(localStorage.getItem(incomeTitle) == null) {
        localStorage.setItem('entry_list', JSON.stringify(income));
    } else {
        alert(`이미 ${incomeTitle}은 추가되었습니다.`);
    }

    또는

    localStorage.setItem(incomeTitle.value, JSON.stringify(income));
    JSON.parse(localStorage.getItem(incomeTitle.value));
    */
});

addOutcome.addEventListener('click', () => {
    if(!outcomeTitle.value || !outcomeAmount.value) return;

    let outcome = {
        type : 'outcome',
        title : outcomeTitle.value,
        amount : parseFloat(outcomeAmount.value),
    }
    ENTRY_LIST.push(outcome);

    updateUI();
    clearInput([outcomeTitle, outcomeAmount]);
    /*
    if(localStorage.getItem(outcomeTitle) == null) {
        localStorage.setItem('entry_list', JSON.stringify(outcome));
    } else {
        alert(`이미 ${outcomeTitle}은 추가되었습니다.`);
    }
    
    localStorage.setItem('entry_list', JSON.stringify(outcome));
    */
});

incomeList.addEventListener('click', deleteOrEdit);
outcomeList.addEventListener('click', deleteOrEdit);
allList.addEventListener('click', deleteOrEdit);

function deleteOrEdit(event) {
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if(targetBtn.id == DELETE) {
        deleteEntry(entry);
    } else if(targetBtn.id == EDIT) {
        editEntry(entry);
    }
}

function deleteEntry(entry) {
    ENTRY_LIST.splice(entry.id, 1);

    updateUI();
}

function editEntry(entry) {
    //console.log(entry.parentNode.id);
    let ENTRY = ENTRY_LIST[entry.parentNode.id];

    if(ENTRY.type == "income") {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    } else if(ENTRY.type == "outcome") {
        outcomeAmount.value = ENTRY.amount;
        outcomeTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI() {
    income = calculateTotal('income', ENTRY_LIST);
    outcome = calculateTotal('outcome', ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = (income >= outcome) ? "₩" : "-₩";

    incomeTotalEl.innerHTML = `<small>${sign}</small>${income}`;
    outcomeTotalEl.innerHTML = `<small>${sign}</small>${outcome}`;
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;

    clearElement([incomeList, outcomeList, allList]);

    ENTRY_LIST.forEach((entry, index) => {
        if(entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        } else if (entry.type == "outcome") {
            showEntry(outcomeList, entry.type, entry.title, entry.amount, index);
        } 
        showEntry(allList, entry.type, entry.title, entry.amount, index);
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
    const entry = `<li id="${id}" class="${type}">
                <div class="list-flex">
                    <div class="date">2021.9.22</div>
                    <div class="desc">${title}</div>
                </div>
                <div class="li-value">${amount}</div>
                <div class="icons">
                    <div id="edit" class="edit"><i class="ri-edit-box-line"></i></div>
                    <div id="delete" class="delete"><i class="ri-delete-bin-7-line"></i></div>
                </div>
            </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, ENTRY_LIST) {
    let sum = 0;
    
    ENTRY_LIST.forEach(entry => {
        if(entry.type == type) {
            sum += entry.amount;
        }
    });

    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function clearInput(inputsArray) {
    inputsArray.forEach(input => {
        input.value = '';
    });
}

function active(element) {
    element.classList.add('active');
}

function inactive(elementsArray) {
    elementsArray.forEach(element => {
        element.classList.remove('active');
    })
}

function show(element) {
    element.classList.remove('hide');
}

function hide(elementsArray) {
    elementsArray.forEach(element => {
        element.classList.add('hide');
    });
    /*
    for(let i = 0; i < elementsArray.length; i++) {
        elementsArray[i].classList.add('hide');
    }
    */
}

cancelIncome.addEventListener('click', () => {
    incomeAmount.value = "";
    incomeTitle.value = "";
})

cancelOutcome.addEventListener('click', () => {
    outcomeAmount.value = "";
    outcomeTitle.value = "";
})
