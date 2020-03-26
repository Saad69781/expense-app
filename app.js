//stroage Controller
const StroageCtrol = (function() {
  return {
    stroageItem: function(item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        items.push(item);

        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemFromStroage: function() {
      let items;

      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStroage: function(updateSate) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((ele, index) => {
        if (updateSate.id === ele.id) {
          items.splice(index, 1, updateSate);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemStroage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((ele, index) => {
        if (id === ele.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllItemsFromStroage: function() {
      localStorage.removeItem("items");
    }
  };
})();

//item Controller
const ItemCtrol = (function() {
  const Item = function(id, val, amount) {
    this.id = id;
    this.val = val;
    this.amount = amount;
  };

  const data = {
    item: StroageCtrol.getItemFromStroage(),
    // item: [],
    currentItem: null,
    totalAmount: 0
  };

  return {
    getData: function() {
      return data.item;
    },
    additem: function(name, amount) {
      let id;

      if (data.item.length > 0) {
        id = data.item[data.item.length - 1].id + 1;
      } else {
        id = 0;
      }
      amount = parseInt(amount);

      newItem = new Item(id, name, amount);

      data.item.push(newItem);

      return newItem;
    },
    getTotalAmount: function() {
      let total = 0;
      data.item.forEach(ele => {
        total += ele.amount;
      });
      data.totalAmount = total;
      return data.totalAmount;
    },
    getItembyID: function(itemId) {
      let found = null;

      data.item.forEach(ele => {
        //console.log(ele.id);
        if (ele.id === itemId) {
          found = ele;
        }
      });

      return found;
    },
    setcurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getItemToUpdate: function(val, amount) {
      amount = parseInt(amount);
      let found = null;
      data.item.forEach(ele => {
        if (ele.id === data.currentItem.id) {
          ele.val = val;
          ele.amount = amount;
          found = ele;
        }
      });
      return found;
    },
    deleteSelectedItem: function(id) {
      const ids = data.item.map(ele => {
        return ele.id;
      });

      const index = ids.indexOf(id);

      data.item.splice(index, 1);
    },
    clearitems: function() {
      data.item = [];
    }
  };
})();

// ui Controller
const UiCtrol = (function() {
  const uiSelector = {
    itemList: "#item-list",
    allListItem: "#item-list li",
    addbtn: ".add-btn",
    addExpenceItem: "#item-name",
    addamount: "#add-amount",
    totalExpense: ".total-expense",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn ",
    clearBtn: ".clear-btn"
  };
  return {
    populateList: function(items) {
      let html = "";

      items.forEach(element => {
        html += `<li class="collection-item" id="item-${element.id}">
        <strong>${element.val}: </strong><em>${element.amount} Amount</em>
        <a href="#" class="secondary-content">
          <i class=" edit-item fa fa-pencil"></i>
        </a>
      </li>
      `;
      });

      const totalExpense = ItemCtrol.getTotalAmount();

      UiCtrol.displayTotalExpense(totalExpense);

      document.querySelector(uiSelector.itemList).innerHTML = html;
    },
    getitem: function() {
      return {
        value: document.querySelector(uiSelector.addExpenceItem).value,
        amount: document.querySelector(uiSelector.addamount).value
      };
    },
    uiSelector: function() {
      return uiSelector;
    },
    addListItems: function(element) {
      document.querySelector(uiSelector.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${element.id}`;
      li.innerHTML = ` <strong>${element.val}: </strong><em>${element.amount} Amount</em>
        <a href="#" class="secondary-content">
          <i class=" edit-item fa fa-pencil"></i>
        </a>`;
      document
        .querySelector(uiSelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    hideList: function() {
      document.querySelector(uiSelector.itemList).style.display = "none";
    },
    clearinput: function() {
      document.querySelector(uiSelector.addExpenceItem).value = "";
      document.querySelector(uiSelector.addamount).value = "";
    },

    displayTotalExpense: function(cal) {
      document.querySelector(uiSelector.totalExpense).innerHTML = cal;
    },
    editState: function() {
      UiCtrol.clearinput();
      document.querySelector(uiSelector.updateBtn).style.display = "none";
      document.querySelector(uiSelector.deleteBtn).style.display = "none";
      document.querySelector(uiSelector.backBtn).style.display = "none";
      document.querySelector(uiSelector.addbtn).style.display = "inline";
    },
    editToForm: function() {
      document.querySelector(uiSelector.updateBtn).style.display = "inline";
      document.querySelector(uiSelector.deleteBtn).style.display = "inline";
      document.querySelector(uiSelector.backBtn).style.display = "inline";
      document.querySelector(uiSelector.addbtn).style.display = "none";
    },
    addItemToForm: function() {
      document.querySelector(
        uiSelector.addExpenceItem
      ).value = ItemCtrol.getCurrentItem().val;
      document.querySelector(
        uiSelector.addamount
      ).value = ItemCtrol.getCurrentItem().amount;
      UiCtrol.editToForm();
    },
    updateUIItemFromBtn: function(item) {
      const allListItem = document.querySelectorAll(uiSelector.allListItem);

      const arrayList = Array.from(allListItem);

      arrayList.forEach(ele => {
        const itemID = ele.getAttribute("id");
        console.log(itemID);

        const x = document.querySelector(`#${itemID}`).innerHTML;
        console.log(x);

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = ` <strong>${item.val}: </strong><em>${item.amount} Amount</em>
        <a href="#" class="secondary-content">
          <i class=" edit-item fa fa-pencil"></i>
        </a>`;
        }
      });
    },
    editClearState: function() {
      document.querySelector(uiSelector.addExpenceItem).value = "";
      document.querySelector(uiSelector.addamount).value = "";
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearDisplayItems: function() {
      let listItems = document.querySelector(uiSelector.allListItem);

      const arrayList = Array.from(listItems);

      arrayList.forEach(ele => {
        ele.remove();
      });
    }
  };
})();

//App Conntroller

const App = (function(itemController, uiController, stroageController) {
  const uiSelector = uiController.uiSelector();

  const loadedEvent = function() {
    document
      .querySelector(uiSelector.addbtn)
      .addEventListener("click", additem);
    document
      .querySelector(uiSelector.itemList)
      .addEventListener("click", clickEditState);
    document
      .querySelector(uiSelector.updateBtn)
      .addEventListener("click", updateEditState);
    document
      .querySelector(uiSelector.backBtn)
      .addEventListener("click", uiController.editClearState);
    document
      .querySelector(uiSelector.deleteBtn)
      .addEventListener("click", itemDeleteHandler);

    document
      .querySelector(uiSelector.clearBtn)
      .addEventListener("click", clearAllItem);

    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };
  const additem = function(event) {
    event.preventDefault();
    const input = uiController.getitem();
    console.log(input);
    if (input.value !== "" && input.amount !== "") {
      const newItem = itemController.additem(input.value, input.amount);
      console.log(newItem);

      uiController.addListItems(newItem);

      const totalExpense = itemController.getTotalAmount();

      uiController.displayTotalExpense(totalExpense);

      uiController.clearinput();

      stroageController.stroageItem(newItem);
    }
  };

  const clickEditState = function(event) {
    event.preventDefault();
    if (event.target.classList.contains("edit-item")) {
      const listID = event.target.parentNode.parentNode.id;
      const listArrayID = listID.split("-");
      const id = parseInt(listArrayID[1]);
      //console.log(id);

      const itemToEdit = itemController.getItembyID(id);
      //console.log(itemToEdit);

      itemController.setcurrentItem(itemToEdit);

      uiController.addItemToForm();
    }
  };

  const updateEditState = function(event) {
    event.preventDefault();
    const input = uiController.getitem();
    const updatestate = itemController.getItemToUpdate(
      input.value,
      input.amount
    );
    uiController.updateUIItemFromBtn(updatestate);

    const totalExpense = itemController.getTotalAmount();

    uiController.displayTotalExpense(totalExpense);

    stroageController.updateItemStroage(updatestate);

    uiController.editClearState();
  };

  const itemDeleteHandler = function(e) {
    e.preventDefault();
    const currentItem = itemController.getCurrentItem();
    itemController.deleteSelectedItem(currentItem.id);
    uiController.deleteListItem(currentItem.id);
    const totalExpense = itemController.getTotalAmount();

    uiController.displayTotalExpense(totalExpense);

    stroageController.deleteItemStroage(currentItem.id);

    uiController.editClearState();
  };
  const clearAllItem = function() {
    itemController.clearitems();
    uiController.clearDisplayItems();
    const totalExpense = itemController.getTotalAmount();

    uiController.displayTotalExpense(totalExpense);

    uiController.clearinput();

    uiController.hideList();

    stroageController.clearAllItemsFromStroage();
  };
  return {
    init: function() {
      uiController.editState();
      const items = itemController.getData();

      if (items.length === 0) {
        uiController.hideList();
      } else {
        uiController.populateList(items);
      }

      loadedEvent();
    }
  };
})(ItemCtrol, UiCtrol, StroageCtrol);

App.init();
