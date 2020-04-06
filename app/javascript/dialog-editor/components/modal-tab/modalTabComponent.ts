import { AbstractModal } from '../abstractModal';

/**
 * @memberof miqStaticAssets
 * @ngdoc component
 * @name dialogEditorModalTab
 * @description
 *    Component contains templates for the modal for editing dialog editors
 *    tab (group) details
 * @example
 * <dialog-editor-modal-tab></dialog-editor-modal-tab>
 */
export default class ModalTabTemplate extends AbstractModal {
  template = require('./tab.html');
}
