var Note = React.createClass({
    render: function(){
        let color = {backgroundColor: this.props.color};
        return (
            <div className="note" style={color}>
                {this.props.children}
                <span className="note_delete" onClick={this.props.onDelete}> x </span>
            </div>
        )
    }
});

var NoteEditor = React.createClass({
    getInitialState: function(){
        return {
            text:'',
            color: '#fff'
        }
    },

    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },

    handleNoteAdd: function() {
        console.log(this.state.color);
        let note = {
            id: Date.now(),
            text: this.state.text,
            color: this.state.color
        };
        this.props.onNoteAdd(note);
        this.setState({text: '', color: '#fff'});
    },

    handleChangeColor: function(color) {
        this.setState({color: color});
    },

    render: function(){
        return (
            <div className="note_editor">
                <textarea style={{backgroundColor: this.state.color}} className="textarea" rows="6" placeholder="Enter your note here..." value={this.state.text} onChange={this.handleTextChange}></textarea>
                <ColorPicker changeColor={this.handleChangeColor}/>
                <button className="add_button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        )
    }
});

var ColorPicker = React.createClass({
    render: function() {
        let colors = [{id: 1, name: '#1100aa'}, {id: 2, name: '#33bb55'},
        {id: 3, name: '#77cc44'}, {id: 4, name: '#777aaa'},
        {id: 5, name: '#00aacc'}, {id: 6, name: '#00bb11'},
        {id: 7, name: '#22ccff'}];

        let changeColor = this.props.changeColor;
        
        return (
            <div className='colors_holder'>
                <ul>
                    {
                        colors.map(function (color) {
                            let noteColor = {backgroundColor: color.name}
                            return <li className="color" onClick={changeColor.bind(null, color.name)} style={noteColor} key={color.id}></li>
                        })
                    }
                </ul>
            </div>
        )
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function(){
        var elem = this.refs.grid;
        this.msnry = new Masonry( elem, {
        // options
            itemSelector: '.note',
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(newProps) {
        if (newProps.notes.length != this.props.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function(){
        var onNoteDelete = this.props.onNoteDelete;
        return (
            <div className="notes_grid" ref="grid">
            {
                this.props.notes.map(function(note) {
                    return <Note
                        key={note.id}
                        color={note.color}
                        onDelete={onNoteDelete.bind(null, note)}>
                        {note.text}
                    </Note>;
                })
            }
            </div>
        )
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {                
            notes: []
        }
    },

    componentDidMount: function() {
        var notes = JSON.parse(localStorage.getItem('notes'));
        this.setState({notes: notes});
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({notes: newNotes});
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id != noteId;
        });
        this.setState({notes: newNotes});
    },

    render: function(){
        return (
            <div className="notes_app">
                <NoteEditor onNoteAdd={this.handleNoteAdd}/>
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}/>
            </div>
        )
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('mount_pointer')
);