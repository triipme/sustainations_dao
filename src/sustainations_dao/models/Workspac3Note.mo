import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
  public let defaultNoteLabels = [
    "Family", "Work", "Tasks", "Priority", "Personal", "Friends"
  ];

  public type Note = {
    owner : Principal;
    timestamp : Time.Time;
    payload : NotePayoad;
  };

  public type NotePayoad = {
    title : ?Text;
    description : ?Text;
    image : ?Text;
    todos : ?[Todo];
    labels : ?[Text];
    remindTime : ?Time.Time;
    archived : Bool;
  };

  public type Todo = {
    name : Text;
    completed : Bool;
  };
};