import _ from '@lodash';

function NoteListItemModel(data) {
  data = data || {};

  return _.defaults(data, {
    name: '',
    completed: false,
  });
}

export default NoteListItemModel;
