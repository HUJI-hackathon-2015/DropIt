/**
 * Created by tmrlvi on 4/30/15.
 */
function setLocation(name){

}

function addNewLabel(name, population, to_sort){
    var newLabel = $("<li>").addClass("tag-item").data({"population" : population}).text(name);
    $("#tag-list").append(newLabel);
}

$(function(){
        // Dialog for the creation of new label
        dialog = $("#dialog-form").dialog({
                autoOpen: false,
                modal: true,
                buttons: {
                    Ok: function(){
                        socketClient.newLabel($("#tag").val())
                        dialog.dialog( "close" );
                    },
                    Cancel: function() {
                        dialog.dialog( "close" );
                    }
                }
            })
        $("#new-label-button").on("click", function(){
            var name = prompt("Choose a name for your new label!");
            socketClient.newLabel(name);
        });

});

