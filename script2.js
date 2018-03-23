function go() {
	// const storage4 = getStorage();
	
	// const storage3 = JSON.parse(localStorage.getItem('todoList3'));
	// setStorage(storage3.slice(0, storage3.length));

	// const storage4 = JSON.parse(localStorage.getItem('todoList4'));
	// setStorage(storage4.slice(0, storage4.length));

	
	addList();
	

};
 
 // it removes from storage out of date entries due to today's date 
function updateStorage() {
	const storage = getStorage();
	const today = new Date();
	const todayMilliseconds = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
	
	// const tomorrow = todayMilliseconds + ((1000*60*60*24) * 1);
	// alert(storage[0].date);
	// alert(todayMilliseconds);

		if (storage[0].date !== todayMilliseconds) {
	// if(storage[0].date === todayMilliseconds) {
	// 	alert('yes');
	// } else {
	// 	alert('no');
	// }
		const week = storage.filter((item, i) => {
	// alert(new Date(item.date));	
		if(item.date >= todayMilliseconds) {
			// alert(new Date(item.date) + '\n' + new Date(tomorrow));
			return Object.assign({}, item);
		}		
	});
	const copy = week.length === 7 ? false : storage[((storage.length - week.length) - 1)];
	// alert(typeof copy);	
	const yesterday = {};
	Array.from(Object.keys(copy)).forEach(item => {
			if (item !== 'yesterday') {
				// alert(typeof copy[item]);
				yesterday[item] =  copy[item];
			}
		});
	// alert(week.length);
	const tempArr = [{}, {}, {}, {}, {}, {}, {}];	
	for(let i = 0; i < 7; i++) {
		if(week[i] !== undefined) {
			//tempArr[i] = JSON.parse(JSON.stringify(week[i]));
			tempArr[i] = Object.assign({}, week[i]);
		} else {
			tempArr[i].date = todayMilliseconds + ((1000*60*60*24) * i);
		}	
	}
	//alert(Object.keys(Object.assign({}, copy)));
	// tempArr[0]['yesterday'] = Object.assign({}, copy);
	tempArr[0]['yesterday'] = JSON.parse(JSON.stringify(yesterday));	
	setStorage(tempArr);
	} 	
}

// it attaches all tasks from storage to the chosen day container on the page.
function displayTaskOnPage(number, dayObj) {
	let dayStorage;
	let tasks;
	if (!dayObj) {
		const storage = getStorage();
		dayStorage = storage[number];
		tasks = Object.keys(dayStorage).filter(item => item.toString().length === 13);
	} else {
		dayStorage = dayObj;
		tasks = Object.keys(dayStorage).filter(item => item.toString().length === 13);
	}
	
	const container = document.getElementById('taskContainer' + number);
	container.innerHTML = '';	
	tasks.forEach((item, i) => {
		const div = document.createElement('div');
		const lblTaskNumber = document.createElement('label');
		lblTaskNumber.innerHTML =  'Task' + (i + 1) + '. ';
		div.appendChild(lblTaskNumber);
		const lblTask = document.createElement('label');
		lblTask.setAttribute('name', 'data');
		lblTask.innerHTML = dayStorage[item].task;
		div.appendChild(lblTask);
		const lblPriority = document.createElement('label');
		lblPriority.innerHTML = ' Priority: ';
		div.appendChild(lblPriority);
		const txtPriority = document.createElement('label');
		txtPriority.setAttribute('name', 'data');
		txtPriority.innerHTML = dayStorage[item].priority;
		div.appendChild(txtPriority);
		const lblState = document.createElement('label');
		lblState.innerHTML = ' State: ';
		div.appendChild(lblState);
		const txtState = document.createElement('label');
		txtState.setAttribute('name', 'data');
		txtState.innerHTML = dayStorage[item].state;
		div.appendChild(txtState);
		const btnState = document.createElement('input');
		btnState.setAttribute('type', 'button');
		btnState.setAttribute('value', 'Change State');
		btnState.setAttribute('id', 'btnState' + number + i);
		btnState.addEventListener('click', function() {
			const storage = getStorage();
			storage[number][item].state = storage[number][item].state === 'todo' ? 'done' : 'todo';
			setStorage(storage);
			document.getElementById('selectFilter' + number).value = 'FILTER (no filtration)';
			document.getElementById('selectSort' + number).value = 'SORT (no sorting)';
			displayTaskOnPage(number);			
		});
		div.appendChild(btnState);
		const btnDelete = document.createElement('input');
		btnDelete.setAttribute('type', 'button');
		btnDelete.setAttribute('value', 'Delete task');
		btnDelete.setAttribute('id', 'btnDelete' + number + i);
		btnDelete.addEventListener('click', function() {
			const storage = getStorage();
			delete storage[number][item];
			setStorage(storage);
			document.getElementById('selectFilter' + number).value = 'FILTER (no filtration)';
		    document.getElementById('selectSort' + number).value = 'SORT (no sorting)';
			displayTaskOnPage(number);
		});
		div.appendChild(btnDelete);
		container.appendChild(div);
	});
};

function createDateContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'dateContainer' + number);
	div.setAttribute('name', 'dateContainer');
	const par = document.createElement('p');
	par.setAttribute('id', 'parDate' + number);
	par.setAttribute('name', 'parDate');
	const content = document.createTextNode('DATE');
	par.appendChild(content);
	div.appendChild(par);
	return div;
};

function createUtilityContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'utilContainer' + number);
	div.appendChild(createSelectFilter(number));
	div.appendChild(createSelectSort(number));
	return div;
}

function createSelectFilter(number) {
	const selectFilter = document.createElement('select');
	selectFilter.setAttribute('id', 'selectFilter' + number);
	selectFilter.addEventListener('change', function() {
		switch(this.selectedIndex){			
			case 1: displayTaskOnPage(number, filter(number, 1));
			break;
			case 2: displayTaskOnPage(number, filter(number, 2));
			break;
			default : displayTaskOnPage(number, filter(number, 0));
			break;
		}
	});
	const filterArr = ['FILTER (no filtration)', 'Task will be done', 'Task has been done'];
	for (var i = 0; i < filterArr.length; i++) {
		const optionFilter = document.createElement('option');
		if(i === 0) {
			optionFilter.selected = true;
		} 
		optionFilter.value = filterArr[i];
		optionFilter.text = filterArr[i];
		selectFilter.appendChild(optionFilter);
	}
	return selectFilter; 
}

function filter(day, index) {
	document.getElementById('selectSort' + day).value = 'SORT (no sorting)';
	const container = getStorage()[day];
	const tasks = Object.keys(container).filter(item => item.toString().length === 13);
	const result = tasks.map((key) => {
		if (index === 1) {
			if(container[key].state === 'todo'){
				return container[key];
			}
		} else if(index === 2) {
			if(container[key].state === 'done'){
				return container[key];
			}
		} else {
			return container[key];
		}
	}).filter(item => typeof item === 'object');	
	const obj = {};
	result.forEach(item => obj[item.time] = item);
	return obj;
}

function sortPriority(day,index) {
	const tasks = document.getElementById('taskContainer' + day).getElementsByTagName('div');
	const high = [];
	const middle =[];
	const low = [];
	Array.from(tasks).map(div => {
		Array.from(div.getElementsByTagName('label')).map(label => {
			if (label.textContent === 'high') {
				high.push(div);
			} else if(label.textContent === 'middle') {
				middle.push(div);
			} else if(label.textContent === 'low') {
				low.push(div);
			}			
		});
	});
	const result = index === 3 ? high.concat(middle).concat(low) : low.concat(middle).concat(high);	
	document.getElementById('taskContainer' + day).innerHTML = '';
	result.map(item => {		
		document.getElementById('taskContainer' + day).appendChild(item);
	});
}

function sortABC(day, index) {
	const tasks = [];
	const taskContainer =document.getElementById('taskContainer' + day);
	const divs = taskContainer.childNodes;
	const order = index === 1 ? 1 : -1;	
	const result = Array.from(divs).sort(function(a, b) {
		if (a.getElementsByTagName('label')[1].textContent > b.getElementsByTagName('label')[1].textContent) {			
			return order;
		}
		if (a.getElementsByTagName('label')[1].textContent < b.getElementsByTagName('label')[1].textContent) {			
			return order > 0 ? -1 : 1;
		}
		return 0;
	});
	taskContainer.innerHTML = '';
	result.forEach(item => {
		taskContainer.appendChild(item);
	});
}

function sort(day, index) {
	switch(index) {
		case 1: sortABC(day, index);
		break;
		case 2: sortABC(day, index);
		break;
		case 3: sortPriority(day,index);
		break;
		case 4: sortPriority(day,index);
		break;
	}
}

function createSelectSort(number) {
	const selectSort = document.createElement('select');
	selectSort.setAttribute('id', 'selectSort' + number);
	selectSort.addEventListener('change', function() {
		switch(this.selectedIndex){			
			case 1: sort(number, 1);
			break;
			case 2: sort(number, 2);
			break;
			case 3: sort(number, 3);
			break;
			case 4: sort(number, 4);
			break;
			default :
				const selectedIndexFilter = document.getElementById('selectFilter' + number).selectedIndex;			
				displayTaskOnPage(number, filter(number, selectedIndexFilter));
			break;
		}
	});
	const sortArr = ['SORT (no sorting)','A -> z', 'Z -> a', 'Priority high -> low', 'Priority low -> high'];
	for (var i = 0; i < sortArr.length; i++) {
		const optionSort = document.createElement('option');
		if(i === 0) {
			optionSort.selected = true;
		} 
		optionSort.value = sortArr[i];
		optionSort.text = sortArr[i];		
		selectSort.appendChild(optionSort);
	}
	return selectSort;
}

function createAlltaskContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'taskContainer' + number);
	div.setAttribute('name', 'taskContainer');
	return div;
}

function createAddtaskContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'formContainer' + number);
	const button = document.createElement('input');
	button.setAttribute('type', 'button');
	button.setAttribute('id', 'btnForm' + number);
	button.setAttribute('value', 'Add task');
	button.addEventListener('click', function() {
		addForm(button, div, number);
	});
	div.appendChild(button);
	return div;
};

function createFormContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'form' + number);
	return div;
}

function createDayContainer(number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'dayContainer' + number);
	div.setAttribute('name', 'dayContainer');
	div.appendChild(createDateContainer(number));
	div.appendChild(createUtilityContainer(number));
	div.appendChild(createAlltaskContainer(number));
	div.appendChild(createAddtaskContainer(number));
	return div;
};

// it checks if the storage exists
// if not, it creates the storage [{},{},...] with set dates for 7 days starting from today
// and return an object with confirmation and massage
function existStorage() {	
	if (localStorage) {
		if (!localStorage.getItem('todoList2')) {
			const weekArr = [{'yesterday': {}}, {}, {}, {}, {}, {}, {}];				
			localStorage.setItem('todoList2', JSON.stringify(setDate(weekArr)));
			return {
				exist: true,
				message: 'Entry for your Todo list has been successfully created!',
			};
		} else {
			return {
				exist: true,
				message: 'Entry exists.',
			};
		}
	} else {
		return {
				exist: false,
				message: 'Thiere is no localStorage on the computer :(',
			};
	}
};

// it returns a new set date for the whole week starting from today's day
function setDate(arr) {	
	const today = new Date();
	const date = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();	
	const oneDayMilliseconds = (1000*60*60*24);
	const result = arr.map((item, i) => {
		item['date'] = (date + (oneDayMilliseconds * i));
		// alert(new Date(item.date));
		return item;
	});
	return result;
}

// it adds a form for a new task
function addForm(button, parent, number) {
	const div = document.createElement('div');
	div.setAttribute('id', 'form' + number);	
	parent.appendChild(div);
	popupDialogForm(number);
	// button.style.visibility = 'hidden';
}

function getStorage() {
	return JSON.parse(localStorage.getItem('todoList2'));
}

function setStorage(storage) {
	localStorage.setItem('todoList2', JSON.stringify(storage));
}

//it attaches dates to page
function attachDateGlobally() {	
	const dateFields = document.getElementsByName('parDate');
	const date = new Date().getTime();
	const oneDayMilliseconds = (1000*60*60*24);	
		dateFields.forEach((item, i) => {
			let dayInfo = '';
			if (i === 0) {
				dayInfo = 'Today ';
			} else if(i === 1) {
				dayInfo = 'Tomorrow ';
			}
			item.textContent = dayInfo + formatData(date + (oneDayMilliseconds * i));
		});
}

// it formats date to be displayd on the page
function formatData(milliseconds) {	
	const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];	
	const date = new Date(milliseconds);		
	const dayName = days[date.getDay()];
	const day = date.getDate().length === 1 ? ('0' + date.getDate()) : date.getDate();
	const month = date.getMonth().toString().length === 1 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
	const year = date.getFullYear();
	return dayName + '   ' + day + '.' + month + '.' + year;
}

// it adds a set of radio buttons to the 'add task' form
function addRadioButton(quantity, nameArr, parent, name) {	
	for (let i = 0; i < quantity; i++) {
		const lbl = document.createElement('label');
		lbl.innerHTML = nameArr[i];
		const rdbtn = document.createElement('input');
		rdbtn.setAttribute('type', 'radio');
		rdbtn.setAttribute('name', name);
		rdbtn.setAttribute('value', nameArr[i]);
		if(i === 0) {
			rdbtn.setAttribute('checked', true);
		}
		parent.appendChild(lbl);
		parent.appendChild(rdbtn);
	}
	const br = document.createElement('br');
	parent.appendChild(br);
}

// формирует всплывающее окно
// собирает введёные данные если нажата кнопка confirm
// сохраняет объект с данными в storage
function popupDialogForm(number) {
	const divLining = document.createElement('div');
	divLining.setAttribute('class', 'lining');
	const divForm = document.createElement('div');
	divLining.appendChild(divForm);

	const txtTask = document.createElement('input');
	txtTask.setAttribute('type', 'text');
	txtTask.setAttribute('id', 'txtForm');
	txtTask.setAttribute('maxlength', 30);
	txtTask.setAttribute('required', '');
	txtTask.setAttribute('autofocus', true);
	txtTask.setAttribute('placeholder', 'Enter task here...');
	divForm.appendChild(txtTask);
	const br1 = document.createElement('br');
	divForm.appendChild(br1);

	const lblPriority = document.createElement('label');
	lblPriority.innerHTML = 'Priority'
	divForm.appendChild(lblPriority);
	const br2 = document.createElement('br');
	divForm.appendChild(br2);

	const priorityArr = ['high', 'middle', 'low'];
	addRadioButton(priorityArr.length, priorityArr, divForm, 'rdbtnPriority');
	// const br3 = document.createElement('br');
	// divForm.appendChild(br3);
	const lblState = document.createElement('label');
	lblState.innerHTML = 'State';
	divForm.appendChild(lblState);
	const br4 = document.createElement('br');
	divForm.appendChild(br4);

	const stateArr = ['todo', 'done'];
	addRadioButton(stateArr.length, stateArr, divForm, 'rdbtnState');	

	const btnConfirm = document.createElement('input');
	btnConfirm.setAttribute('type', 'button');
	btnConfirm.setAttribute('value', 'Confirm');
	btnConfirm.addEventListener('click', function() {
		const task = txtTask.value;
		if(task !== '') {
			const priorityList = document.getElementsByName('rdbtnPriority');
		    const priority = Array.from(priorityList).filter(item => item.checked === true)[0].value;
			const stateList = document.getElementsByName('rdbtnState');		
			const state = Array.from(stateList).filter(item => item.checked === true)[0].value;
			const time = new Date().getTime();
			const storage = getStorage();
			storage[number][time] = {
				number,
				time,
				task,
				priority,
				state,
			};
		setStorage(storage);
		displayTaskOnPage(number);
		document.getElementById('selectFilter' + number).value = 'FILTER (no filtration)';
		document.getElementById('selectSort' + number).value = 'SORT (no sorting)';
		divLining.style.visibility = 'hidden';		
		} else {
			alert('Enter task, please...');
		}		
	});
	divForm.appendChild(btnConfirm);

	const btnCancel = document.createElement('input');
	btnCancel.setAttribute('type', 'button');
	btnCancel.setAttribute('value', 'Cancel');
	btnCancel.addEventListener('click', function() {
		divLining.style.visibility = 'hidden';
	});
	divForm.appendChild(btnCancel);
	const body = document.getElementsByTagName('body'); 
	body[0].appendChild(divLining);
}

// it appends a set of radio buttons to the page
function rbtnChoice(type, lblValue, name, arr, parent, number) {
	// alert(number);
	const br0 = document.createElement('br');
	parent.appendChild(br0);
	const lbl = document.createElement('label');
	const lblText = document.createTextNode(lblValue);
	lbl.appendChild(lblText);
	parent.appendChild(lbl);
	const br = document.createElement('br');
	parent.appendChild(br);
	for (var i = 0; i < arr.length; i++) {
		const lbl = document.createElement('label');
		const lblText = document.createTextNode(arr[i]);
		lbl.appendChild(lblText);
		parent.appendChild(lbl);
		const rdbtn = createElement('input', arr[i], name, number);
		rdbtn.setAttribute('value', arr[i]);
		rdbtn.setAttribute('type', type);
		parent.appendChild(rdbtn);
	}	
}

function createYesterday() {	
	const db = getStorage();
	const div = document.createElement('div');
	div.setAttribute('id', 'yesterday');
	const btnYesterday = document.createElement('input');
	btnYesterday.setAttribute('type', 'button');
	btnYesterday.setAttribute('value', 'Show Yesterday\'s tasks');
	btnYesterday.addEventListener('click', function() {		
		let strings = 'Yesterday, ' + formatData(new Date().getTime() - (1000*60*60*24)) + '\n\n';
		if(Object.keys(db[0].yesterday).length > 1) {			
		Object.keys(db[0].yesterday).filter(item => item.length === 13).
			forEach(item2 => {
				const date = new Date(db[0].yesterday[item2].time);
				const hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
				const mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
				//const ss = date.getSeconds();
				const time = hh + ':' + mm;// + ' : ' + ss;
				let str = '';
				str += 'Task: ' + db[0].yesterday[item2].task + '\n';
				str += 'Time: ' + time + '\n';				
				str += 'Priority: ' + db[0].yesterday[item2].priority + '  ';
				str += 'State: ' + db[0].yesterday[item2].state + '  ';
				strings += str + '\n\n';
			});
			alert(strings);
		} else {
			alert('No tasks\n' + strings);
		}		

	});
	div.appendChild(btnYesterday);
	return div;
}

function removeAllTasks(db) {
	const div = document.createElement('div');
	const btnRemoveAllTasks = document.createElement('input');
	btnRemoveAllTasks.setAttribute('type', 'button');
	btnRemoveAllTasks.setAttribute('value', 'Remove all tasks');
	btnRemoveAllTasks.addEventListener('click', function() {
		if(confirm('All tasks will be removed permanently.')) {
			localStorage.removeItem('todoList2');
			addList();
		}
	});
	div.appendChild(btnRemoveAllTasks);
	return div;
}

function appendDayDivs(clearContent) {	
	const divContent = document.getElementById('content');
	if (clearContent === true) {
		divContent.innerHTML = '';
	}
		divContent.appendChild(createYesterday());
		for(let i = 0; i < 7; i++) {
			const br1 = document.createElement('br');
			const br2 = document.createElement('br');
			divContent.appendChild(br1);
			divContent.appendChild(br2);
			divContent.appendChild(createDayContainer(i));			
			const hr = document.createElement('hr');
			divContent.appendChild(hr);						
			// alert(storage.message); 
		}
		divContent.appendChild(removeAllTasks());
}

function appendTasks() {
	for(let i = 0; i < 7; i++) {
		displayTaskOnPage(i);
	}
}

function timer() {
	const today = new Date().getTime();
	const lastDate = getStorage()[0].date;
	// alert(new Date(lastDate) + '\n' + new Date() + '\n' + new Date(lastDate + (1000*60*60*24)));
	if ((lastDate + (1000*60*60*24)) < new Date().getTime()) {
		updatePage(true);
	}
}

function updatePage(clearContent) {
	updateStorage();
	appendDayDivs(clearContent);
	attachDateGlobally();	
	appendTasks();	
}

// it shows the todo list on the page
function addList() {
// localStorage.removeItem('todoList2');		
	if(existStorage()) {		
		updatePage();
		setInterval(function(){ timer(); }, 60000);
	} else {
		alert('No access to local storage :(');
	}
}





// function setDate(number) {
// 	const storage = getStorage();
// 	const todayMilliseconds = new Date().getTime();
// 	storage[i]['date'] = todayMilliseconds + (oneDayMilliseconds * number);
// 	setStorage(storage);
// }

// function getDate(number) {
// 	const storage = getStorage();
// 	return storage[number]['date'];
// }







































// function go() {
// 	getTodoList();
// 	const obj = {
// 		dayContainer0 : {},
// 		dayContainer1 : {},
// 		dayContainer2 : {},
// 		dayContainer3 : {},
// 		dayContainer4 : {},
// 		dayContainer5 : {},
// 		dayContainer6 : {},
// 	};
// 	// obj['dayContainer' + 0] = {};
// 	obj['dayContainer0']['time'] = '10';
// 	obj['dayContainer0']['taskContainer0'] = {};
// 	obj['dayContainer0']['taskContainer0']['task' + 0] = {};
// 	obj['dayContainer0']['taskContainer0']['task' + 1] = {};
// 	obj['dayContainer0']['taskContainer0']['task' + 0]['task'] = 'Wake up!';
// 	alert(obj.dayContainer0.taskContainer0.length);
// 	// setHeaderContent()
// }

// function setHeaderContent() {
// 	const header = document.getElementById('header');
// 	const btnCheck = createElement('input', 'btnCheck');
// 	btnCheck.setAttribute('type', 'button');
// 	btnCheck.addEventListener('click', function() {

// 		storageWrite(undefined, undefined, undefined,0);
// 		moveWeekForwadr();
// 		//getMilliseconds();
// 		// getTodoList();
// 		// const todoList = JSON.parse(localStorage.getItem('todoList'));
// 		// alert(todoList.length);
// 		//alert(document.getElementById('parDay' + 0).getAttribute('milliseconds'));
// 	});
// 	header.appendChild(btnCheck);
// }

// function getMilliseconds(dayNumber) {
// 	const today = new Date();
//     const day = today.getDay();    
// 	const month = today.getMonth();
// 	const year = today.getFullYear();
// 	const oneDayMilliseconds = (1000*60*60*24);
// 	const todayMilliseconds = new Date(year, month, day).getTime();
// 	// const daysPassed = Math.floor((todayMilliseconds + (oneDayMilliseconds * dayNumber)) - todayMilliseconds)/oneDayMilliseconds;
// 	var d = new Date();
//     const f = d.setDate(d.getDate() + dayNumber);
// 	//alert(new Date(f));
// 	return new Date(f);
// 	// return todayMilliseconds + (oneDayMilliseconds * dayNumber);
// }

// function storageWrite(task, priority, state, milliseconds) {
// // alert(arguments[3]);
// }

// function moveTime(beginning) {
// 	const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];	
//     const now = new Date();
//     const day = now.getDay();
    
// 	const month = now.getMonth();
// 	const year = now.getFullYear(); 
//     const today = new Date(year, month, day);
//     const dayName = days[now.getDay()];
//     // const beginning = now.getDay();
//     const days2 = [];
   
//     const leftSide = days.slice(beginning, days.length);
// 	const rightSide = days.slice(0, beginning);
// 	const week = leftSide.concat(rightSide);
// 	const oneDayMilliseconds = (1000*60*60*24);
// 	const todayMilliseconds = new Date().getTime();
//     for(let i = 0; i < 7; i++) {
//     let dayInfo = ''; 	
//     	if (i === 0) {
//     		dayInfo = 'Today  ' + week[i];
//     	} else if(i === 1) {
//     		dayInfo = 'Tomorrow  ' + week[i];
//     	} else {
//     	dayInfo = week[i];
//     	}
//     	const parDay = document.getElementById('parDay' + i);
//     	parDay.textContent =  getMilliseconds(i);//dayInfo;
//     	// parDay.setAttribute('milliseconds', getMilliseconds(i));
//     }
// }

// let count = 0;

// function moveWeekForwadr() {
// 	const todoList = JSON.parse(localStorage.getItem('todoList'));
// 	// todoList.forEach(item => alert(item));
// 	const yesterday = todoList.splice(0, 1);
// 	todoList.push([]);
// 	localStorage.setItem('todoList', JSON.stringify(todoList));
// 	// alert(yesterday.length);
// 	// const todolistContainer = document.getElementById('content');
// 	// const lastDayNumber = 7;
// 	// todolistContainer.appendChild(createDayContainer(lastDayNumber));
// 	for (let containerNumber = 0; containerNumber < 7; containerNumber++) {
// 		readStorage(containerNumber);
// 	}
// 	++count;
// if(count === 7) {
// count = 0;
// }

// 	moveTime(count);
// 	// setDate();
// 	return yesterday;
// }

// function setDate() {
// 	// const today = new Date();
// 	// alert(date.getFullYear() + '\n' + date.getMonth());
// 	// let day = today.getDate();
// 	// let month = today.getMonth();
// 	// let year = today.getFullYear();
// 	// // alert(day + '\n' + (month + 1) +  '\n' + year);
// 	// // if(day < 10){day = '0' + day}
// 	// // 	if(month < 10){month = '0' + (month + 1)}
// 	// // alert(day + '\n' + month + '\n' + year);

// 	// var today = new Date(day, month, year);
// 	// alert(today);
// 	// var now = new Date()
// 	// var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// 	// var yesterday = new Date(today.valueOf() - 86400000).valueOf();
// 	// alert(yesterday);

// // 	// Первая дата (год, месяц, день)
// // var Date1 = new Date (2008, 7, 25);

// // // Вторая дата (год, месяц, день)
// // var Date2 = new Date (2009, 0, 12);

// // // Сколько целых дней между датами
// // var Days = Math.floor((Date2.getTime() - Date1.getTime())/(1000*60*60*24));

// 	const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
//     const now = new Date();
//     const day = now.getDay();
    
// 	const month = now.getMonth();
// 	const year = now.getFullYear(); 
//     const today = new Date(year, month, day);
//     const dayName = days[now.getDay()];
//     const dayObj = {
//     	0: 'Sunday',
//     	1: 'Monday',
//     	2: 'Tuesday',
//     	3: 'Wednesday',
//     	4: 'Thursday',
//     	5: 'Friday',
//     	6: 'Sunday',
//     }
//     const dayObj1 = {
//     	0: 'Sunday',
//     	1: 'Monday',
//     	2: 'Tuesday',
//     	3: 'Wednesday',
//     	4: 'Thursday',
//     	5: 'Friday',
//     	6: 'Sunday',
//     }

//     const beginning = now.getDay();
//     const days2 = [];
   
//     const leftSide = days.slice(beginning, days.length);
// 	const rightSide = days.slice(0, beginning);
// 	const week = leftSide.concat(rightSide);
//     for(let i = 0; i < 7; i++) {
//     let dayInfo = ''; 	
//     	if (i === 0) {
//     		dayInfo = 'Today is ' + week[i];
//     	} else if(i === 1) {
//     		dayInfo = 'Tomorrow is ' + week[i];
//     	} else {
//     	dayInfo = week[i];
//     	}
//     	document.getElementById('parDay' + i).textContent = dayInfo;
//     }
// }

// function createDateContainer(number) {
// 	const div = createElement('div', 'dateContainer', 'dateContainer', number);
// 	const par = createElement('p', 'parDay', 'parDay', number);
// 	const content = document.createTextNode('DATE');
// 	par.appendChild(content);
// 	div.appendChild(par);
// 	return div;
// }

// function createUtilityContainer(number, sorter, filter) {
// 	const div = createElement('div', 'utilityContainer', 'utilityContainer', number);
// 	div.appendChild(creatButtonFilter(number));	
// 	div.appendChild(creatButtonSort(number));	
// 	return div;
// }

// function createAlltaskContainer(number) {
// 	const div = createElement('div', 'allTaskContainer', 'allTaskContainer', number);
// 	return div;
// }

// function createNewtaskContainer(number) {	
// 	const div = createElement('div', 'newTaskContainer', 'newTaskContainer', number);
// 	div.appendChild(createButtonAddtask(number));
// 	return div;
// }

// function createDayContainer(number) {
// 	const dayContainer = createElement('div', 'dayContainer', 'dayContainer', number);
// 	const dateContainer = createDateContainer(number);
// 	const utilityContainer = createUtilityContainer(number);
// 	const allTaskContainer = createAlltaskContainer(number);
// 	const newTaskContainer = createNewtaskContainer(number);
// 	const hr = createElement('hr');
// 	dayContainer.appendChild(dateContainer);	
// 	dayContainer.appendChild(utilityContainer);
// 	dayContainer.appendChild(hr);
// 	dayContainer.appendChild(allTaskContainer);
// 	dayContainer.appendChild(newTaskContainer);
// 	return dayContainer;
// }

// function createElement(tag, id, name, number, style, attributes) {
// 	const elem = document.createElement(tag);
// 	elem.setAttribute('id', id + number);
// 	elem.setAttribute('name', name + number);
// 	return elem;
// }

// function creatButtonFilter(number) {
// 	const selectFilter = createElement('select', 'selectFilter', 'selectFilter', number);
// 	selectFilter.addEventListener('change', function() {
// 			const filterd = filterTasks(this, number);
// 			readStorage(number, '', filterd);
// 			const sortButton = document.getElementById('selectSort' + number);
// 			const sorted = sortTasks(sortButton, number);
// 			readStorage(number, '', sorted);
// 		});
// 	const filterArr = ['FILTER (no filtration)', 'Task will be done', 'Task has been done'];
// 	for (var i = 0; i < filterArr.length; i++) {
// 		const optionFilter = document.createElement('option');
// 		if(i === 0) {
// 			optionFilter.selected = true;
// 		} 
// 		optionFilter.value = filterArr[i];
// 		optionFilter.text = filterArr[i];
// 		selectFilter.appendChild(optionFilter);
// 	}
// 	return selectFilter;
// }

// function filterTasks(btnFilter, number) {
// 	let choice = '';
// 			const chosen = [];
// 			switch(btnFilter.selectedIndex){
// 				case 0 : choice = 'restore';
// 				break;
// 				case 1 : choice = 'todo';
// 				break;
// 				case 2 : choice = 'done';
// 				break;
// 			}
// 			const todoList = JSON.parse(localStorage.getItem('todoList'));
// 			for (var i = 0; i < todoList[number].length; i++) {
// 				if (choice === 'restore') {
// 					chosen.push(todoList[number][i]);
// 				} else if(todoList[number][i].state === choice) {
// 					// alert(todoList[number][i].task);
// 					chosen.push(todoList[number][i]);
// 				}
// 			}
// 			return chosen;
// }

// function creatButtonSort(number) {
// 	const selectSort = createElement('select', 'selectSort', 'selectSort', number);
// 	selectSort.addEventListener('change', function() {
// 			const chosen = sortTasks(this, number);
// 			// alert(chosen.forEach(item => alert(item.task)));
// 			readStorage(number, '', chosen);
// 		});
// 	const sortArr = ['SORT (no sorting)','A -> z', 'Z -> a', 'Priority high -> low', 'Priority low -> high'];
// 	for (var i = 0; i < sortArr.length; i++) {
// 		const optionSort = createElement('option');
// 		if(i === 0) {
// 			optionSort.selected = true;
// 		} 
// 		optionSort.value = sortArr[i];
// 		optionSort.text = sortArr[i];		
// 		selectSort.appendChild(optionSort);
// 	}
// 	return selectSort;
// }

// function sortTasks(btnSort, number) {
// 	const taskContainerContent = document.getElementById('allTaskContainer' + number).getElementsByTagName('div');	
// 	const divData = collectDivData(taskContainerContent);
// 	// const todoList = JSON.parse(localStorage.getItem('todoList'));
// 	// const originOrderDivArr = todoList[number].map(item => item);
// 	// const nosortingDivData = originOrderDivArr.filter(item => {
// 	// 	// alert(item.task)
// 	// 	return divData.map(item2 => {
// 	// 		if(item2.task === item.task){
// 	// 			// alert(item.task);
// 	// 			return item;
// 	// 		}
// 	// 	});
// 	// });
// 	// alert(divData.length);
// 	// alert(originOrderDivArr.length);

// 	//alert(document.getElementById('selectFilter' + number).selectedIndex);
// 	const filterButton = document.getElementById('selectFilter' + number);
// 			const filterd = filterTasks(filterButton, number);
// 			// readStorage(number, '', sorted);
	
// 	switch(btnSort.selectedIndex){
// 		case 0 : return filterd;//divData;//nosortingDivData;
// 		case 1 : return sortAz(divData, number);
// 		case 2 : return sortZa(divData, number);
// 		case 3 : return sortPriority(divData, 'high');
// 		case 4 : return sortPriority(divData, 'low');
// 		// default: divData;
// 		// break;
// 	}
// }

// function collectDivData(divs) {
// 	const divArr = Array.from(divs);
// 	const data = divArr.map(item => {
// 		const obj = {
// 			task: item.getElementsByTagName('span')[0].textContent,
// 			priority: item.getElementsByTagName('span')[1].textContent,
// 			state: item.getElementsByTagName('span')[2].textContent,
// 		}
// 		return obj;
// 	});
// 	return data;
// }

// function sortPriority(divArr, priority) {
// 	const high = divArr.filter(item => item.priority === 'high');	
// 	const middle = divArr.filter(item => item.priority === 'middle');
// 	const low = divArr.filter(item => item.priority === 'low');       
// 	const result = priority === 'high' ? high.concat(middle).concat(low) : low.concat(middle).concat(high);	
// 	// alert(result[0].task);
// 	return result;
// }

// function createButtonAddtask(number) {
// 	const button = createElement('button', 'btnAddtask', 'btnAddtask', number);
// 	const value = document.createTextNode('Add Task');
// 	button.style.visibility = 'visible';
// 	button.appendChild(value);
// 	button.addEventListener('click', function() {
// 		removeNewtaskform();
// 		createAddtaskForm(button.parentNode, number);
// 		changeVisibilityAddtaskbutton(button);
// 	});
// 	return button;
// }

// function createAddtaskForm(parent, number) {
// 	const div = createElement('div', 'newTaskForm', 'newTaskForm', number);
// 	const txtTask = document.createElement('input');
// 	txtTask.setAttribute('type', 'text');
// 	txtTask.setAttribute('id', 'txtForm' + number);
// 	txtTask.setAttribute('maxlength', 30);
// 	txtTask.setAttribute('required', '');
// 	txtTask.setAttribute('autofocus', true);
// 	txtTask.setAttribute('placeholder', 'Enter task here...');
// 	const priorityArr = ['high', 'middle', 'low'];
// 	const stateArr = ['todo', 'done'];
// 	div.appendChild(txtTask);

// 	createRbtnChoice('radio', 'Priority', 'priority', priorityArr, div, number);
// 	createRbtnChoice('radio', 'State', 'state', stateArr, div, number);	
// 	const br = document.createElement('br');
// 	div.appendChild(br);
// 	addAddbtn(div, number);
// 	addCancelbtn(div);
// 	parent.appendChild(div);
// }

// function addAddbtn(parent, dayNumber) {
// 	const btn = createElement('input', 'apply', 'apply');
// 	btn.setAttribute('type', 'button');
// 	btn.setAttribute('value', 'Apply');
// 	btn.addEventListener('click', function() {		
// 		const newTaskData = checkFormdata(collectFormdata(dayNumber));
// 		if(newTaskData) {
// 			writeStorage(dayNumber, newTaskData);
// 			const btnFilter = document.getElementById('selectFilter' + dayNumber);
// 			const filterd = filterTasks(btnFilter, dayNumber);
// 			readStorage(dayNumber, '', filterd);
// 			const btnSort = document.getElementById('selectSort' + dayNumber);
// 			const sorted = sortTasks(btnSort, dayNumber);
// 			readStorage(dayNumber, '', sorted);
// 			changeVisibilityAddtaskbutton(parent.parentNode.firstChild);
// 			parent.parentNode.removeChild(parent.parentNode.lastChild);			
// 		} else {
// 			alert('No task chosen...');
// 		}
// 	});
// 	parent.appendChild(btn);
// }

// function addCancelbtn(parent) {
// 	const btn = createElement('input', 'cancel', 'cancel');
// 	btn.setAttribute('type', 'button');
// 	btn.setAttribute('value', 'Cancel');
// 	btn.addEventListener('click', function() {
// 		changeVisibilityAddtaskbutton(parent.parentNode.firstChild);
// 		parent.parentNode.removeChild(parent);
		
// 	});
// 	parent.appendChild(btn);
// }

// function writeStorage(dayNumber, data) {
// 	if (localStorage) {	
// 		if (!localStorage.getItem('todoList')) {
// 			const weekArr = [];
// 			for (var i = 0; i < 7; i++) {
// 				weekArr.push([]);				
// 			}
// 			localStorage.setItem('todoList', JSON.stringify(weekArr));
// 		} else {
// 			const weekArr = JSON.parse(localStorage.getItem('todoList'));
// 			const taskNumber = weekArr[dayNumber].length;
// 			weekArr[dayNumber][taskNumber] = data;
// 			localStorage.setItem('todoList', JSON.stringify(weekArr));	
// 		}
// 	} else {
// 		alert('Thiere is no localStorage on the computer :(');
// 	}
// }

// function removeTask(btnId) {
// 	const containerId = (document.getElementById(btnId).parentNode.parentNode.id).replace(/\D+/,"");
// 	const spanColl = document.getElementById(btnId).parentNode.getElementsByTagName('span');
// 	const todoList = JSON.parse(localStorage.getItem('todoList'));
// 	const taskArr = Array.from(spanColl).map(item => item.textContent);
// 	let counter = 0;
// 	const updatedContainer = todoList[containerId].filter(item => {
// 		if(item.task === taskArr[0] &&
// 			item.priority === taskArr[1] &&
// 			  item.state === taskArr[2] && counter === 0){
// 			  ++counter;			
// 		} else {
// 				return item;
// 		}
// 	});
// 	todoList[containerId] = updatedContainer;
// 	localStorage.setItem('todoList', JSON.stringify(todoList));
// 		const btnFilter = document.getElementById('selectFilter' + containerId);
// 		const filterd = filterTasks(btnFilter, containerId);
// 		readStorage(containerId, '', filterd);
// }

// function changeState(btnId) {
// 	const containerId = (document.getElementById(btnId).parentNode.parentNode.id).replace(/\D+/,"");
// 	const taskData = document.getElementById(btnId).parentNode.getElementsByTagName('span');
// 	const todoList = JSON.parse(localStorage.getItem('todoList'));
// 	const updatedContainer = todoList[containerId].map(item => {
// 		if(item.task === taskData[0].textContent &&
// 			item.priority === taskData[1].textContent &&
// 		 		item.state === taskData[2].textContent){
// 					item.state = item.state === 'done' ? 'todo' : 'done';
// 		}
// 		return item;
// 	});
// 	todoList[containerId] = updatedContainer;
// 	localStorage.setItem('todoList', JSON.stringify(todoList));
// 		const btnFilter = document.getElementById('selectFilter' + containerId);
// 		const filterd = filterTasks(btnFilter, containerId);
// 		readStorage(containerId, '', filterd);

// 		const btnSort = document.getElementById('selectSort' + containerId);
// 		const sorted = sortTasks(btnSort, containerId);
// 		readStorage(containerId, '', sorted);

// }

// function collectFormdata(number) {
// 	const task = document.getElementById('txtForm' + number).value;
// 	let priority;
// 	const priorityArr = document.getElementsByName('priority' + number);
// 	for (var i = 0; i < priorityArr.length; i++) {
// 		if(priorityArr[i].checked) {
// 			//alert(priorityArr[i].value);
// 			priority = priorityArr[i].value;
// 		}
// 	}
// 	const stateArr = document.getElementsByName('state' + number);
// 	let state;
// 	for (var i = 0; i < stateArr.length; i++) {
// 		if(stateArr[i].checked) {
// 			state = stateArr[i].value;
// 		}
// 	}
// 	const data = {
// 		task,
// 		priority,
// 		state,
// 		milliseconds: 0,
// 	}
// 	return data;
// }
 
// function checkFormdata(data) {
// 	if(data.task === '') {
// 		return false;
// 	} else {
// 		if(!data.priority){
// 			data.priority = 'middle';
// 		}
// 		if(!data.state){
// 			data.state = 'todo';
// 		}
// 		return data;
// 	}
// }

// function createRbtnChoice(type, lblValue, name, arr, parent, number) {
// 	// alert(number);
// 	const br0 = document.createElement('br');
// 	parent.appendChild(br0);
// 	const lbl = document.createElement('label');
// 	const lblText = document.createTextNode(lblValue);
// 	lbl.appendChild(lblText);
// 	parent.appendChild(lbl);
// 	const br = document.createElement('br');
// 	parent.appendChild(br);
// 	for (var i = 0; i < arr.length; i++) {
// 		const lbl = document.createElement('label');
// 		const lblText = document.createTextNode(arr[i]);
// 		lbl.appendChild(lblText);
// 		parent.appendChild(lbl);
// 		const rdbtn = createElement('input', arr[i], name, number);
// 		rdbtn.setAttribute('value', arr[i]);
// 		rdbtn.setAttribute('type', type);
// 		parent.appendChild(rdbtn);
// 	}	
// }

// function changeVisibilityAddtaskbutton(button) {
// 	if(button.style.visibility === 'hidden') {
// 	   	button.style.visibility = 'visible';
// 	   	return;
// 	}
// 	if(button.style.visibility === 'visible') {
// 		button.style.visibility = 'hidden';
// 	}
// }

// function removeNewtaskform() {
// 	for (var i = 0; i < 7; i++) {
// 		const form = document.getElementById('newTaskForm' + i);
// 		if (form) {
// 			form.parentNode.removeChild(form);
// 			changeVisibilityAddtaskbutton(document.getElementById('btnAddtask' + i));
// 		}		
// 	}	
// }

// function createRemoveAlltaskButton() {
// 	const clearButton = document.createElement('input');
// 	clearButton.setAttribute('type', 'button');
// 	clearButton.setAttribute('value', 'Remove all tasks');
// 	clearButton.addEventListener('click', function() {
// 		if(confirm('Remove all tasks?')){
// 			localStorage.removeItem('todoList');
// 			localStorage.setItem('todoList', JSON.stringify([[], [], [], [], [], [], []]));
// 		}
// 	});
// 	return clearButton;
// }

// function readStorage(containerNumber, lastTaskNumber, prossesedContainer) {
// 	let j;
// 	let lastElement;
// 	const allTaskContainer = document.getElementById('allTaskContainer' + containerNumber);
// 	let todoList = JSON.parse(localStorage.getItem('todoList'));
// 	todoList = todoList[containerNumber];
	
// 	if (todoList || prossesedContainer) {
// 		if(prossesedContainer) {
// 			j = 0;
// 			lastElement = prossesedContainer.length;
// 			todoList = prossesedContainer;
// 	    } else {						
// 			j = lastTaskNumber === undefined ? 0 : lastTaskNumber;
// 			lastElement = j === 0 ? todoList.length : lastTaskNumber + 1;		
// 		}

// 		if(j === 0) {
// 			allTaskContainer.innerHTML = '';
// 		}
			
// 		for (j; j < lastElement; j++) {
// 			const div = createElement('div', 'task', 'task', j);
// 			const lblTask = document.createElement('label');
// 			const lblTaskText = document.createTextNode(j + 1 + '. Task:' + "\u00A0");
// 			lblTask.appendChild(lblTaskText);
// 			div.appendChild(lblTask);
// 				const spanTask = document.createElement('span');
// 				const spanTaskText = document.createTextNode(todoList[j].task);
// 				spanTask.appendChild(spanTaskText);
// 				div.appendChild(spanTask);

// 				const lblPriority = document.createElement('label');
// 				const lblPriorityText = document.createTextNode("\u00A0" + 'Priority:' + "\u00A0");
// 				lblPriority.appendChild(lblPriorityText);
// 				div.appendChild(lblPriority);
// 				const spanPriority = document.createElement('span');
// 				spanPriority.setAttribute('name', 'priority');
// 				const spanPriorityText = document.createTextNode(todoList[j].priority);
// 				spanPriority.appendChild(spanPriorityText);
// 				div.appendChild(spanPriority);

// 				const lblState = document.createElement('label');
// 				const lblStateText = document.createTextNode("\u00A0" + 'State:' + "\u00A0");
// 				lblState.appendChild(lblStateText);
// 				div.appendChild(lblState);
// 				const spanState = document.createElement('span');
// 				spanState.setAttribute('name', 'state');
// 				const spanStateText = document.createTextNode(todoList[j].state);
// 				spanState.appendChild(spanStateText);
// 				div.appendChild(spanState);

// 				const btnChangeState = document.createElement('input');
// 				btnChangeState.setAttribute('type', 'button');
// 				btnChangeState.setAttribute('id', 'btnChangeState' + containerNumber + j);
// 				btnChangeState.setAttribute('value', 'Change State');
// 				btnChangeState.addEventListener('click', function() {
// 					changeState(this.id);
// 				});
// 				div.appendChild(btnChangeState);

// 				const btnRemove = document.createElement('input');
// 				btnRemove.setAttribute('type', 'button');
// 				btnRemove.setAttribute('id', 'btnRemove' + containerNumber + j);
// 				btnRemove.setAttribute('value', 'Remove Task');
// 				btnRemove.addEventListener('click', function() {
// 					removeTask(this.id);
// 				});
// 				div.appendChild(btnRemove);

// 				allTaskContainer.appendChild(div);
// 				const br = document.createElement('br');
// 				allTaskContainer.appendChild(br);
// 			}
// 	} else {
// 		alert('No access to the entry in localStorage.');
// 	}		
// }

// function getTodoList() {
// 	// localStorage.removeItem('todoList');
// 	if (localStorage) {
// 		if (!localStorage.getItem('todoList')) {
// 			const weekArr = [];
// 			for (var i = 0; i < 7; i++) {
// 				weekArr.push([]);				
// 			}
// 			localStorage.setItem('todoList', JSON.stringify(weekArr));
// 			alert('Entry for your Todo list has been successfully created!');
// 		} else {
// 			// alert(localStorage.getItem('todoList'))
// 		}
// 	} else {
// 		alert('Thiere is no localStorage on the computer :(');
// 	}

// 	const todolistContainer = document.getElementById('content');
// 	for (let allTaskContainerNumber = 0; allTaskContainerNumber < 7; allTaskContainerNumber++) {
// 		todolistContainer.appendChild(createDayContainer(allTaskContainerNumber));
// 		readStorage(allTaskContainerNumber);
// 	}	
// 	const br = document.createElement('br');
// 	todolistContainer.appendChild(br);
// 	const clearButton = createRemoveAlltaskButton();
// 	todolistContainer.appendChild(clearButton);

// 	setDate();

// }

// function storageWrite(containerNumber, taskNumber, task, priority, state, time) {
// 	const todoList = JSON.parse(localStorage.getItem('todoList'));
// 	todoList[containerNumber][taskNumber]
// }



