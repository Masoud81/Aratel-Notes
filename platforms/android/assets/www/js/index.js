$(function() {
	
    var app = {
        // Aplication Constructor
        initialize: function() {
            this.bindEvents();
            this.db = null;
        },

        bindEvents: function() {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        },

        onDeviceReady: function() {
            app.db = window.openDatabase('aratel_notes', '1.0', 'Aratel Notes', 5000000);
            app.testDbExists();
            
            $("#save").click(function () {
                app.db.transaction(app.insertNote, function () {
                }, function () {
                    
                });
            });
        },
        
        testDbExists: function() {
            var exists = window.localStorage.getItem("dbExists");
            
            if(exists === null) {
                app.createDb();
            }
            else {
                app.queryDb();
            }
        },
        
        createDb: function() {
            app.db.transaction(app.populateDB, app.errorCB, app.successCB);
        },
        
        populateDB: function(tx) {
            tx.executeSql('DROP TABLE IF EXISTS NOTES');
            tx.executeSql('CREATE TABLE IF NOT EXISTS NOTES (id unique, title, text)');
        },
        
        errorCB: function(err) {
            
        },
        
        successCB: function() {
            window.localStorage.setItem("dbExists", 1);
        },
        
        queryDb: function() {
            app.db.transaction(app.queryNotes);
        },
        
        queryNotes: function(tx) {
            
            tx.executeSql('SELECT * FROM NOTES', [], function(tx, results) {
                var notesListHtml = "";
                for(var i=0 ; i<results.rows.length ; i++) {
                    notesListHtml += '<li><a>'+ results.rows.item(i).title +'</a></li>';
                }

                var notesList = $("#leftbar ul");
                notesList.html(notesListHtml);
                notesList.listview("refresh");
                
                $("#leftbar ul a").click(function (event) {
                app.db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM NOTES WHERE title="'+$(event.currentTarget).text()+'"', [], function (tx, results) {
                        $("#title").val(results.rows.item(0).title);
                        $("#text").val(results.rows.item(0).text);
                    });
                });
                $("#title").val();
            });
                
            }, function(err) {
                window.alert('query exec error! '+err);
            });
        },
        
        insertNote: function(tx) {
            
            var titleTxt = $("#title").val();
            var textTxt = $("#text").val();
            
            tx.executeSql('INSERT INTO NOTES(title, text) VALUES("'+titleTxt+'", "'+textTxt+'")');
            app.queryDb();
        }
        
//        LastNoteId: function () {
//            
//            app.db.transaction(function (tx) {
//                tx.executeSql('SELECT id FROM NOTES ORDER BY id', [], function )
//            })
//        }
    };

    app.initialize();
});