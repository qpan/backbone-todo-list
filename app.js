(function(){
  'use strict';

  var Item = Backbone.Model.extend({
    defaults: {
      task: "",
      inputDisabled: true,
      editDisabled: false,
      cancelDisabled: true,
      saveDisabled: true,
      checked: false,
    }
  });

  var Items = Backbone.Collection.extend({
    model: Item
  });

  var ItemView = Backbone.View.extend({
    className: "item",

    events: {
      "click .item__delete": "deleteItem",
      "click .item__edit": "enableChangeToInputText",
      "click .item__cancel": "cancelChangeToInputText",
      "click .item__save": "saveItemChanges",
      "keyup .item__field": "keyAction"
    },

    initialize: function(){
      this.model.on("destroy", this.deleteItemView, this);
      this.model.on("change", this.rerender, this);
    },

    deleteItem: function(e){

      this.model.destroy();
    },
    deleteItemView: function(model){

      this.$el.remove();
    },

    enableChangeToInputText: function(e){

      this.cachedInputValue = this.$el.find(".item__field").val();

      this.model.set({inputDisabled:false, cancelDisabled:false, saveDisabled:true});

      var itemField = this.$el.find(".item__field");
      var strLength= itemField.val().length * 2;
      itemField[0].setSelectionRange(strLength, strLength);
      itemField.focus();
    },

    cancelChangeToInputText: function(e){

      this.$el.find(".item__field").val(this.cachedInputValue);

      this.model.set({inputDisabled:true, editDisabled:false, cancelDisabled:true, saveDisabled:true});
    },

    saveItemChanges: function(e){

      this.model.set({inputDisabled:true, editDisabled:false, cancelDisabled:true, saveDisabled:true});
    },

    keyAction: function(e){

      this.model.set({editDisabled:true, saveDisabled:false});
    },

    render: function(){
      var template = _.template($("#tpl").html());

      this.$el.html( template(this.model.toJSON()) );

      return this;
    },

    rerender: function(model){
      this.$el.find(".item__field").prop("disabled", this.model.get("inputDisabled"));
      this.$el.find(".item__edit").prop("disabled", this.model.get("editDisabled"));
      this.$el.find(".item__cancel").prop("disabled", this.model.get("cancelDisabled"));
      this.$el.find(".item__save").prop("disabled", this.model.get("saveDisabled"));

      return this;
    }
  });

  var ItemsView = Backbone.View.extend({
    el: "#container",
    className: "todos",
    collection: Items,

    initialize: function(){
      this.collection.on("add", this.addedItemToCollection, this);
    },

    addedItemToCollection: function(model){

      var itemView = new ItemView({model:model});
      this.$el.find("#form").after(itemView.render().$el);

    },

    render: function(){
      var self = this;

      this.collection.each(function(item){
        self.$el.append(new ItemView({model:item}).render().$el);
      });

      return this;
    }
  });

  var FormView = Backbone.View.extend({
    el: "#form",

    events: {
      "click #submit": "addItemToCollection"
    },

    addItemToCollection: function(e){

      e.preventDefault();

      var textInput = this.$el.find("input#todo-item");
      var inputValue = textInput.val().trim();

      if(inputValue !== "") {
        var item = new Item({task:inputValue});
        this.collection.add(item);

        textInput.val("");
      } return false;
    }

  });

  var data = [
    {task:"item 3"},
    {task:"item 4"},
    {task:"item 5"}
  ]

  var items = new Items(data);

  var formView = new FormView({collection:items});

  var itemsView = new ItemsView({collection:items});
  itemsView.render();

})();
