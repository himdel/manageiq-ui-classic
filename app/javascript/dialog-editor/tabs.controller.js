export class TabsController {
  constructor(DialogEditor) {
    this.DialogEditor = DialogEditor;
  }

  // Activate the first tab in tab list, if there is any.
  $onInit() {
    // load tabs data from the service
    this.tabList = this.DialogEditor.getDialogTabs();

    // set active tab
    if (this.tabList.length !== 0) {
      this.DialogEditor.activeTab = 0;
      this.tabList[this.DialogEditor.activeTab].active = true;
    }

    // set options for sorting tabs in list
    this.sortableOptions = {
      cancel: '.nosort',
      cursor: 'move',
      helper: 'clone',
      revert: 50,
      stop: (e, ui) => {
        const sortedTab = angular.element(ui.item).scope().$parent;
        const { tabList } = sortedTab.vm;
        this.DialogEditor.updatePositions(tabList);

        const activeTab = _.find(tabList, { active: true });
        this.DialogEditor.activeTab = activeTab.position;
      },
    };
  }

  // Append a new tab to the list and set active.
  addTab() {
    // deactivate currently active tab
    this.tabList.forEach((tab) => (tab.active = false));

    // create a new tab
    const nextIndex = this.tabList.length;
    this.tabList.push({
      description: __('New tab ') + nextIndex,
      display: 'edit',
      label: __('New tab ') + nextIndex,
      position: nextIndex,
      active: true,
      dialog_groups: [{
        label: __('New section'),
        position: 0,
        dialog_fields: [],
      }],
    });

    this.DialogEditor.activeTab = nextIndex;
    this.DialogEditor.updatePositions(this.tabList);
  }

  // Delete tab and all its content from the dialog.
  // After removing tab, position attributes needs to be updated.
  // If the tab to delete is active in the moment of the deletion, the
  // activity goes to the other tab.
  // @param {number} index of the tab
  removeTab(id) {
    // pass the activity to other tab, if the deleted is active
    if (this.tabList[id].active) {
      if ((this.tabList.length - 1) === this.tabList[id].position
        && (this.tabList.length - 1) !== 0) {
        // active tab was at the end => new active tab is on previous index
        this.tabList[id - 1].active = true;
      } else if ((this.tabList.length - 1) > this.tabList[id].position) {
        // active tab was not at the end => new active tab is on following index
        this.tabList[id + 1].active = true;
      }
    }

    // remove tab with matching id
    _.remove(this.tabList, (tab) => tab.position === id);
    this.DialogEditor.backupSessionStorage(this.DialogEditor.getDialogId(), this.DialogEditor.data);

    // update indexes of other tabs after removing
    if (this.tabList.length !== 0) {
      this.DialogEditor.updatePositions(this.tabList);
    } else {
      return;
    }

    // set activity in the service
    const activeTabData = _.find(this.tabList, { active: true });
    if (angular.isDefined(activeTabData)) {
      this.DialogEditor.activeTab = activeTabData.position;
    }
  }

  // set tab as active, by index
  selectTab(id) {
    // deactivate currently active
    const deselectedTab = _.find(this.tabList, { active: true });
    deselectedTab.active = false;

    // activate selected
    const selectedTab = this.tabList[id];
    selectedTab.active = true;

    this.DialogEditor.activeTab = id;
  }
}

TabsController.$inject = ['DialogEditor'];
