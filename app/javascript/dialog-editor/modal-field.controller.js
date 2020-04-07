import { ModalSharedController } from './modal-shared.controller.js';

export class ModalFieldController extends ModalSharedController {
  $onInit() {
    this.treeOptions = {
      ...this.treeOptions,

      show: false,
      includeDomain: false,
      data: null,

      toggle: () => {
        this.treeOptions.show = !this.treeOptions.show;

        if (this.treeOptions.show) {
          const fqname = this.showFullyQualifiedName(this.modalData.resource_action) || null;

          this.treeOptions.load(fqname).then((data) => {
            this.treeOptions.data = data;
            this.treeOptions.selected = { fqname: `/${fqname}` };
          });
        }
      },

      onSelect: (node) => {
        this.treeSelectorSelect(node, this.modalData);
      },
    };
  }

  showFullyQualifiedName(resourceAction) {
    if (!resourceAction.ae_namespace || !resourceAction.ae_class || !resourceAction.ae_instance) {
      return '';
    }

    return `${resourceAction.ae_namespace}/${resourceAction.ae_class}/${resourceAction.ae_instance}`;
  }

  treeSelectorSelect(node, elementData) {
    const fqname = node.fqname.split('/');

    if (this.treeOptions.includeDomain === false) {
      fqname.splice(1, 1);
    }

    elementData.resource_action = {
      ...elementData.resource_action,
      ae_instance: fqname.pop(),
      ae_class: fqname.pop(),
      ae_namespace: fqname.filter(String).join('/'),
    };

    this.treeOptions.show = false;
  }
}
