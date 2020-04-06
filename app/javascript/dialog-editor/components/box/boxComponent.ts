/**
 * Controller for the Dialog Editor box component
 */
class BoxController {
  constructor(DialogEditor) {
    this.DialogEditor = DialogEditor;
  }

  onFieldEdit(type, tab, box, field) {
    this.setupModalOptions({type, tab, box, field});
  }

  /**
   * Load service to be able to access it form the template.
   * Load status of tabs.
   */
  $onInit() {
    this.service = this.DialogEditor;
    this.dialogTabs = this.DialogEditor.getDialogTabs();
    // Rules for Drag&Drop sorting of boxes
    this.sortableOptionsBox = {
      axis: 'y',
      cancel: '.nosort',
      cursor: 'move',
      opacity: 0.5,
      revert: 50,
      stop: (e, ui) => {
        let sortedBox = ui.item.scope().$parent.tab.dialog_groups;
        // update indexes of other boxes after changing their order
        this.DialogEditor.updatePositions(sortedBox);
      },
    };
    // Rules for Drag&Drop sorting of elements inside of boxes
    this.sortableOptionsFields = {
      axis: 'y',
      cancel: '.nosort',
      cursor: 'move',
      revert: 50,
      stop: (e, ui) => {
        let sortedField = ui.item.scope().$parent.box.dialog_fields;
        // update indexes of other fields after changing their order
        this.DialogEditor.updatePositions(sortedField);
      },
    };
  }

  /**
   * Add a new box to the list.
   * The new box is automatically appended to the last position of the list
   */
  addBox() {
    this.dialogTabs[this.DialogEditor.activeTab].dialog_groups
      .push(
        {
          description: __('Description'),
          label: __('New Section'),
          display: 'edit',
          position: 0,
          dialog_fields: [],
        }
      );
    // update indexes of other boxes after adding a new one
    this.DialogEditor.updatePositions(
      this.dialogTabs[this.DialogEditor.activeTab].dialog_groups
    );
  }

  /**
   * Remove box and all its content from the dialog.
   * @param {number} id as index of removed box
   */
  removeBox(id) {
    _.remove(
      this.dialogTabs[this.DialogEditor.activeTab].dialog_groups,
      (box) => box.position === id
    );
    // update indexes of other boxes after removing
    this.DialogEditor.updatePositions(
      this.dialogTabs[this.DialogEditor.activeTab].dialog_groups
    );
  }

  /**
   * Handle Drag&Drop event.
   * @param {number} event jQuery object
   * @param {number} ui jQuery object
   */
  droppableOptions(e, ui) {
    const elementScope = angular.element(e.target).scope();
    let droppedItem = elementScope.dndDragItem;
    let droppedPlace = elementScope.box;
    // update name for the dropped field
    if (!_.isEmpty(droppedItem)) {
      this.updateFieldName(droppedItem);
    }
    // update indexes of other boxes after changing their order
    this.DialogEditor.updatePositions(
      droppedPlace.dialog_fields
    );
  }

  updateFieldName(field) {
    let nameWithIndex = this.DialogEditor.newFieldName(
      field.name);
    field.name = nameWithIndex;
  }
}

BoxController.$inject = ['DialogEditor'];

/**
 * @description
 *    Component implementing behaviour for the boxes inside of
 *    the dialogs tabs.
 * @example
 * <dialog-editor-boxes>
 * </dialog-editor-boxes>
 */
export default class Box {
  template = require('./box.html');
  controller = BoxController;
  controllerAs = 'vm';
  bindings = {
    setupModalOptions: '&'
  };
}
