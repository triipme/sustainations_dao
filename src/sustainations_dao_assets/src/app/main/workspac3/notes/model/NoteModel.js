import _ from '@lodash';

function NoteModel(data) {
  data = data || {};

  return _.defaults(data, {
    title: '',
    description: '',
    todos: [],
    image: '',
    remindTime: null,
    labels: [],
    archived: false,
  });
}

export default NoteModel;
