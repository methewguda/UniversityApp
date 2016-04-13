/**
 * Author: Methew Guda
 * Author ID: A00381751
 * Dedsription: Modified University DB app that reads data from MongoDB server.
 * Date: 08-04-2016
 */

//##############################################
var SERVER_URL = 'http://dev.cs.smu.ca:8225';//add the url with your own port number
//##############################################


function validateData() {
    //first get the values from the fields
    var name = $("#name").val();
    var address = $("#address").val();
    var phone = $("#phone").val();

    //check empty fields
    if (name == '') {
        alert("Please enter the name of the university!");
        $("#name").focus();
        return false;
    }
    if (address == '') {
        alert("Please enter the address of the university!");
        $("#address").focus();
        return false;
    }
    if (phone == '') {
        alert("Please enter the phone number of the university!");
        $("#phone").focus();
        return false;
    }

    //check address
    //check 1st char if it's a number
    var firstChar = address.trim().substr(0, 1);
    if (isNaN(firstChar)) {
        alert("Address should start with a number!");
        $("#address").focus();
        return false;
    }

    var pattern = /[a-z]/i;

    if (!(pattern.test(address))) {
        alert("Address should contain letters!");
        $("#address").focus();
        return false;
    }


    //check phone
    var tokens = phone.split('-');
    for (var i = 0; i < tokens.length; i++) {
        if (isNaN(tokens[i])) {
            alert("Please use only numbers or hyphens!");
            $("#phone").focus();
            return false;
        }//end if
    }//end for

    return true;
}


function emptyFields() {
    $("#name").val('');
    $("#address").val('');
    $("#phone").val('');
}//end emptyFields()


$('#saveButton').click(
        function () {

            if (validateData()) {

                //create an object
                var newObj = {
                    "Name": $("#name").val(),
                    "Address": $("#address").val(),
                    "PhoneNumber": $("#phone").val()
                };

                $.post(SERVER_URL + '/saveUniversity', newObj,
                    function (data) {
                        alert(data);
                        location.reload();
                    }).fail(function (error) {
                    alert(error.responseText);
                });

            }//end if validateData()

        }//end function
);


$('#searchButton').click(
        function () {

            //empty the fields if something in
            emptyFields();

            //first grab the name of the university
            var key = $('#searchKey').val();

            var universities = [];//place holder
            var i;

            $.post(SERVER_URL + "/getUniversity", key,
                function (data) {
                    alert("Result received successfully!");
                    universities = data;

                    for(i = 0; i < universities.length; i++){
                        if(key == universities[i].Name){
                            alert("The record is found.");
                            $("#name").val(universities[i].Name);
                            $("#address").val(universities[i].Address);
                            $("#phone").val(universities[i].PhoneNumber);
                            $('#searchKey').val("");
                            break;
                        }
                    }

                }).fail(function (error) {
                alert("Error: " +error.responseText);
            });

        }//end function
);



$('#deleteButton').click(
        function () {

            //first grab the name of the university
            var key = $('#searchKey').val();

            $.post(SERVER_URL + "/deleteUniversity", key,
                function (data) {
                    alert(data['Name'] + " removed successfully!");
                }).fail(function (error) {
                alert("Error: " +error.responseText);
            });

        }//end function
);


$('#displayButton').click(
        function () {

            //#############################################

            var universities = [];//place holder
            var i;

            $.post(SERVER_URL + "/getAllUniversities",
                function (data) {
                    alert("Result received successfully!");

                    universities = data;

                    var table = document.getElementById("displayTable");
                    var row = table.insertRow(0);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    cell1.innerHTML = "Name";
                    cell2.innerHTML = "Address";
                    cell3.innerHTML = "Phone Number";

                    for(i = 0; i < universities.length; i++){
                        var table = document.getElementById("displayTable");
                        var row = table.insertRow(i+1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        cell1.innerHTML = universities[i].Name;
                        cell2.innerHTML = universities[i].Address;
                        cell3.innerHTML = universities[i].PhoneNumber;

                        console.log(universities[i]);
                    }

                }).fail(function (error) {
                alert("Error: " +error.responseText);
            });

        }//end function
);
