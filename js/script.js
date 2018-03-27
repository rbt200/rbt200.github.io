function getTodoList() {
	addList();	
};
 
 // it removes from storage out of date entries due to today's date 
function updateStorage() {
	const storage = getStorage();
	const today = new Date();
	const todayMilliseconds = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
		if (storage[0].date !== todayMilliseconds) {
			const week = storage.filter((item, i) => {
		if(item.date >= todayMilliseconds) {
			return Object.assign({}, item);
		}		
	});
	const copy = week.length === 7 ? false : storage[((storage.length - week.length) - 1)];
	const yesterday = {};
	Array.from(Object.keys(copy)).forEach(item => {
			if (item !== 'yesterday') {
				yesterday[item] =  copy[item];
			}
		});
	const tempArr = [{}, {}, {}, {}, {}, {}, {}];	
	for(let i = 0; i < 7; i++) {
		if(week[i] !== undefined) {
			tempArr[i] = Object.assign({}, week[i]);
		} else {
			tempArr[i].date = todayMilliseconds + ((1000*60*60*24) * i);
		}	
	}
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
		lblTaskNumber.style.backgroundColor = 'blue';
		lblTaskNumber.style.marginTop = '1em';
		lblTaskNumber.style.display = 'block';
		lblTaskNumber.innerHTML =  'Task' + (i + 1) + '. ';
		div.appendChild(lblTaskNumber);
		const lblTask = document.createElement('label');
		lblTask.setAttribute('name', 'data');
		lblTask.innerHTML = dayStorage[item].task;
		lblTask.style.display = 'block';
		div.appendChild(lblTask);
		const lblPriority = document.createElement('label');
		lblPriority.innerHTML = ' Priority: ';
		div.appendChild(lblPriority);
		const txtPriority = document.createElement('label');
		txtPriority.setAttribute('name', 'data');
		txtPriority.innerHTML = dayStorage[item].priority;
		txtPriority.style.marginRight = '1em'
		div.appendChild(txtPriority);
		const lblState = document.createElement('label');
		lblState.innerHTML = ' State: ';		
		div.appendChild(lblState);
		const txtState = document.createElement('label');
		txtState.setAttribute('name', 'data');
		txtState.innerHTML = dayStorage[item].state;
		txtState.style.marginRight = '1em'
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
	div.style.background = number % 2 ? 'lightblue' : 'lightgreen';
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

// it forms the popup window
// it collects inputted data if the button 'Confirm' is pressed
// it saves the object containing data in the storage
function popupDialogForm(number) {
	const divBackground = document.createElement('div');
	divBackground.setAttribute('class', 'todo-background');
	const divForm = document.createElement('div');
	divBackground.appendChild(divForm);
	divForm.setAttribute('class', 'todo-background__form');

	const txtTask = document.createElement('input');
	txtTask.setAttribute('type', 'text');
	txtTask.setAttribute('id', 'txtForm');
	txtTask.setAttribute('maxlength', 50);
	txtTask.setAttribute('required', '');
	txtTask.setAttribute('focus', true);
	txtTask.setAttribute('placeholder', 'Enter task here...');
	divForm.appendChild(txtTask);

	const lblPriority = document.createElement('label');
	lblPriority.innerHTML = 'Priority'
	divForm.appendChild(lblPriority);
	lblPriority.style.display = 'block';

	const priorityArr = ['high', 'middle', 'low'];
	addRadioButton(priorityArr.length, priorityArr, divForm, 'rdbtnPriority');
	const lblState = document.createElement('label');
	lblState.innerHTML = 'State';
	lblState.style.display = 'block';
	divForm.appendChild(lblState);

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
		divBackground.style.visibility = 'hidden';		
		} else {
			alert('Enter task, please...');
		}		
	});
	divForm.appendChild(btnConfirm);

	const btnCancel = document.createElement('input');
	btnCancel.setAttribute('type', 'button');
	btnCancel.setAttribute('value', 'Cancel');
	btnCancel.addEventListener('click', function() {
		divBackground.style.visibility = 'hidden';
	});
	divForm.appendChild(btnCancel);
	const body = document.getElementsByTagName('body'); 
	body[0].appendChild(divBackground);
}

// it appends a set of radio buttons to the page
function rbtnChoice(type, lblValue, name, arr, parent, number) {
	parent.style.display = 'block';
	const lbl = document.createElement('label');
	const lblText = document.createTextNode(lblValue);
	lbl.appendChild(lblText);
	parent.appendChild(lbl);
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
				const time = hh + ':' + mm;
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
	const hr = document.createElement('hr');
	div.appendChild(hr);
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
			divContent.appendChild(createDayContainer(i));			
			const hr = document.createElement('hr');
			divContent.appendChild(hr);
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
	if(existStorage()) {		
		updatePage();
		setInterval(function(){ timer(); }, 60000);
	} else {
		alert('No access to local storage :(');
	}
}
