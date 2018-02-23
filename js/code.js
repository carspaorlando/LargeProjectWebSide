
var urlBase = 'http://64.37.54.24';
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";

var overlay = $('#overlay');
var contacts = $('#contacts');

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";
	
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/login.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		document.getElementById("userName").innerHTML = firstName + " " + lastName;
		
		document.getElementById("loginName").value = "";
		document.getElementById("loginPassword").value = "";
                
                overlay.slideUp(400, initContacts());
		
		hideOrShow( "loggedInDiv", true);
		hideOrShow( "accessUIDiv", true);
		hideOrShow( "loginDiv", false);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
	
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";	

	hideOrShow( "loggedInDiv", false);
	hideOrShow( "accessUIDiv", false);
	overlay.slideUp(400, contacts.slideDown(400));
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}
	
	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}


function initContacts() {
    
    var Contacts = {
			index: window.localStorage.getItem("Contacts:index"),
			$table: document.getElementById("contacts-table"),
			$form: document.getElementById("contacts-form"),
			$button_save: document.getElementById("contacts-op-save"),
			$button_discard: document.getElementById("contacts-op-discard"),

			init: function() {
				// initialize storage index
				if (!Contacts.index) {
					window.localStorage.setItem("Contacts:index", Contacts.index = 1);
				}

				// initialize form
				Contacts.$form.reset();
				Contacts.$button_discard.addEventListener("click", function(event) {
					Contacts.$form.reset();
					Contacts.$form.id_entry.value = 0;
				}, true);
				Contacts.$form.addEventListener("submit", function(event) {
					var entry = {
						id: parseInt(this.id_entry.value),
						first_name: this.first_name.value,
						last_name: this.last_name.value,
                                                picture: this.picture.value,
						description: this.description.value
					};
					if (entry.id == 0) { // add
						Contacts.storeAdd(entry);
						Contacts.tableAdd(entry);
					}
					else { // edit
						Contacts.storeEdit(entry);
						Contacts.tableEdit(entry);
					}

					this.reset();
					this.id_entry.value = 0;
					event.preventDefault();
				}, true);

				// initialize table ************** need to change from local storage to database
				if (window.localStorage.length - 1) {
					var contacts_list = [], i, key;
					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Contacts:\d+/.test(key)) {
							contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
						}
					}

					if (contacts_list.length) {
						contacts_list
							.sort(function(a, b) {
								return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
							})
							.forEach(Contacts.tableAdd);
					}
				}
				Contacts.$table.addEventListener("click", function(event) {
					var op = event.target.getAttribute("data-op");
					if (/edit|remove/.test(op)) {
						var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
						if (op == "edit") {
							Contacts.$form.first_name.value = entry.first_name;
							Contacts.$form.last_name.value = entry.last_name;
							Contacts.$form.picture.value = entry.picture;
                                                        Contacts.$form.description.value = entry.description;
							Contacts.$form.id_entry.value = entry.id;
						}
						else if (op == "remove") {
							if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {
								Contacts.storeRemove(entry);
								Contacts.tableRemove(entry);
							}
						}
						event.preventDefault();
					}
				}, true);
			},

			storeAdd: function(entry) {
				entry.id = Contacts.index;
				window.localStorage.setItem("Contacts:index", ++Contacts.index);
				window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
			},
			storeEdit: function(entry) {
				window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
			},
			storeRemove: function(entry) {
				window.localStorage.removeItem("Contacts:"+ entry.id);
			},

			tableAdd: function(entry) {
				var $tr = document.createElement("tr"), $td, key;
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td");
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
				$tr.setAttribute("id", "entry-"+ entry.id);
				Contacts.$table.appendChild($tr);
			},
			tableEdit: function(entry) {
				var $tr = document.getElementById("entry-"+ entry.id), $td, key;
				$tr.innerHTML = "";
				for (key in entry) {
					if (entry.hasOwnProperty(key)) {
						$td = document.createElement("td");
						$td.appendChild(document.createTextNode(entry[key]));
						$tr.appendChild($td);
					}
				}
				$td = document.createElement("td");
				$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
				$tr.appendChild($td);
			},
			tableRemove: function(entry) {
				Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
			}
		};
                
    Contacts.init();
    contacts.fadeIn("slow");
    
}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	
	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = document.getElementById("colorList");
	colorList.innerHTML = "";
	
	var jsonPayload = '{"search" : "' + srch + '"}';
	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				hideOrShow( "colorList", true );
				
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				var i;
				for( i=0; i<jsonObject.results.length; i++ )
				{
					var opt = document.createElement("option");
					opt.text = jsonObject.results[i];
					opt.value = "";
					colorList.options.add(opt);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
