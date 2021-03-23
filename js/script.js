        $(function () {

            var Duplicate = [];

            $('#Reset').click(function (e) {
                e.preventDefault();
                $('#fileInput').val('');
                $('#wrapper').html('');
                alert('Reset Complete!!!')
            });

            $(document).on('click', '#Insert', function () {

                var cfm = confirm("ต้องการ Upload จริงหรือไม่ ?");
                if (!cfm) {
                    return false;
                }

                var i, j, json, myArray = [],
                    data = [];
                var tb = $('table tbody');
                var row = tb.find('tr').length
                var col = tb.find('tr:eq(0)').find('td').length

                var myArray = ["AgentCode", "AgentName", "AgencyCode", "AgencyName", "AgentEmail",
                    "AgencyEmail", "AlEmail", "DOC"
                ]

                for (i = 1; i < row; i++) {
                    var json = {};
                    var tr = tb.find('tr').eq(i)
                    for (j = 0; j < col; j++) {
                        if (j == 0 || j == 2) {
                            json[myArray[j]] = pad(tr.find('td').eq(j).text());
                        } else {
                            json[myArray[j]] = tr.find('td').eq(j).text();
                        }

                    }
                    data.push(json);
                }

                myDB.insert("tbAgent", data)

            });

            $('#btnReset').click(function () {

                $('.formDataAgent input').val('')
                $('.empty').remove();

            });
            $('#btnSave').click(function () {
                InsertOneData();
            });
            $('#btnSearch').click(function (e) {
                e.preventDefault();

                var myArray = ["ID", "รหัสตัวแทน", "ชื่อ ตัวแทน", "รหัสหน่วย", "ชื่อหน่วย",
                    "Email ตัวแทน",
                    "Email หน่วย", "Email หัวหน้าหน่วย", "DOC", "Update"
                ]

                $('.display-table').html("กำลังค้นหา...!!");

                var val = $('#search').val()
                setTimeout(function () {
                    if (val == '') {
                        $('.display-table').html("ไม่พบข้อมูล!!")
                    } else {
                        var strSQL = "SELECT * FROM tbAgent WHERE AgentCode like '%" + val +
                            "%' OR AgentName like '%" + val + "%'"
                        var rs = myDB.query(strSQL)
                        console.log(rs);

                        var tb = "<table id='tbDataAgent'><thead>"
                        for (var i = 0; i < myArray.length; i++) {
                            tb += "<th>" + myArray[i] + "</th>"
                        }
                        tb += "</thead><tbody>"
                        for (var j in rs) {
                            tb += "<tr>"
                            for (var k in rs[j]) {
                                tb += "<td><span>" + rs[j][k] + "</span></td>"
                            }
                            tb += '<td><button class="btn-edit" data-id="' + rs[j].ID +
                                '"><i class="fas fa-edit"></i></button>' +
                                '<button class="btn-save" data-id="' + rs[j].ID +
                                '"><i class="fas fa-save"></i></button>' +
                                '<button class="btn-cancel" data-id="' + rs[j].ID +
                                '"><i class="fa fa-times fa-cancel" ></i></button> ' +
                                '</td></tr>'
                        }
                        tb += "</tbody></table>";
                        $('.display-table').html(tb);
                    }
                }, 1000)
            });
            $('#DOC').change(function () {

                $(this).parent().find('.empty').remove();
                var str = $(this).parent().find('label:eq(0)').text()
                if ($(this).val() != '') {
                    $(this).parent().find('.empty').remove();
                } else {
                    $(this).parent().append("<div class='txt-red empty'>กรุณาระบุข้อมูล " + str
                        .substring(0, str.length - 1) + " !!</div>")
                }

            });

            $(document).on('click', '.btn-edit', function () {
                $(this).edit();
            });
            $(document).on('click', '.btn-cancel', function () {
                $(this).cancel();
            });
            $(document).on('click', '.btn-save', function () {
                $(this).Save();
            });

            $.fn.Save = function () {

                var $confirm = confirm("ต้องการ Update จริงหรือไม่ ? ");

                if (!$confirm) return false;

                var myArray = ["AgentCode", "AgentName", "AgencyCode", "AgencyName", "AgentEmail",
                    "AgencyEmail", "AlEmail", "DOC"
                ]

                var tb = $('#tbDataAgent tbody');
                var rowIndex = $(this).closest('tr').index();
                var colIndex = $(this).closest('td').index();
                var tr = tb.find('tr').eq(rowIndex);
                var inp = tr.find('td').eq(colIndex);
                var ID = tr.find('td:eq(0)').text();

                var strSQL = "UPDATE tbAgent SET "

                inp.find('button:eq(0)').show();
                inp.find('button:eq(1)').hide();
                inp.find('button:eq(2)').hide();

                for (var i = 1; i < colIndex; i++) {
                    var td = tr.find('td').eq(i);
                    var val = td.find('input[type=text]').val()
                    strSQL += myArray[i - 1] + "='" + val + "',"
                    td.html("<span>" + val + "</span>");
                }

                strSQL += " WHERE ID=" + ID
                strSQL = strSQL.replace("', WHERE", "' WHERE");

                if (myDB.query(strSQL, {
                        queryType: "Update"
                    })) {
                    alert("Update สำเร็จ!!!");
                }


            }
            $.fn.cancel = function () {

                var tb = $('#tbDataAgent tbody');
                var rowIndex = $(this).closest('tr').index();
                var colIndex = $(this).closest('td').index();
                var tr = tb.find('tr').eq(rowIndex);
                var inp = tr.find('td').eq(colIndex);

                inp.find('button:eq(0)').show();
                inp.find('button:eq(1)').hide();
                inp.find('button:eq(2)').hide();

                for (var i = 1; i < colIndex; i++) {
                    var td = tr.find('td').eq(i);
                    var val = td.find('input[type=hidden]').val()
                    td.html("<span>" + val + "</span>");
                }

            }

            $.fn.edit = function () {

                let tb = $('#tbDataAgent tbody');
                let rowIndex = $(this).closest('tr').index();
                let colIndex = $(this).closest('td').index();
                var tr = tb.find('tr').eq(rowIndex);
                var inp = tr.find('td').eq(colIndex);

                inp.find('button:eq(0)').hide();
                inp.find('button:eq(1)').show();
                inp.find('button:eq(2)').show();

                for (var i = 1; i < colIndex; i++) {
                    var td = tr.find('td').eq(i);
                    var reSize = td.find('span').width() + 25;
                    var val;
                    var elm = "<input type='hidden' value='" + td.text() + "'><input type='text' value='" +
                        td.text() + "'>"
                    td.html(elm);
                    val = td.find('input[type=hidden]').val()
                    if (val != '') {
                        td.find('input[type=text]').css({
                            "width": reSize,
                            "padding": "0px 2px"
                        })
                    } else {
                        td.find('input[type=text]').css({
                            "width": "160px",
                            "padding": "0px 2px"
                        })
                    }

                }

            }

            function InsertOneData() {

                $('.empty').remove();

                var $AgencyCode = $("#AgencyCode").val();
                var $AgencyName = $("#AgencyName").val();
                var $AgentCode = $("#AgentCode").val();
                var $AgentName = $("#AgentName").val();
                var $AgentEmail = $("#AgentEmail").val();
                var $AgencyEmail = $("#AgencyEmail").val();
                var $ALEmail = $("#ALEmail").val();
                var $DOC = $("#DOC").val();

                var elm = $(".formDataAgent");
                var row = elm.find('input').length;

                for (var i = 0; i < row; i++) {
                    if (elm.find('input')[i].value == '') {
                        var str = $(".formDataAgent .form-group").eq(i).find('label:eq(0)').text()
                        $(".formDataAgent .form-group").eq(i).append(
                            "<div class='txt-red empty'>กรุณาระบุข้อมูล " + str.substring(0, str.length -
                                1) + " !!</div>");
                    }
                }

                if (DOC == '') {
                    var str = $(".formDataAgent .form-group").eq(7).find('label:eq(0)').text()
                    $(".formDataAgent .form-group").eq(7).append(
                        "<div class='txt-red empty'>กรุณาระบุข้อมูล " + str + " !!</div>");
                }

                var err = $('.empty').length
                if (err == 0) {

                    var $confirm = confirm("ต้องการ บันทึก จริงหรือไม่ ? ");

                    if (!$confirm) return false;

                    var strSQL =
                        "INSERT INTO tbAgent (AgentCode,AgentName,AgencyCode,AgencyName,AgentEmail,AgencyEmail,AlEmail,DOC) VALUES " +
                        "('" + $AgentCode + "','" + $AgentName + "','" + $AgencyCode + "','" + $AgencyName +
                        "','" + $AgentEmail + "','" + $AgencyEmail + "','" + $ALEmail + "','" + $DOC + "')"

                    console.log(CheckDuplicateData($AgencyCode));
                    var options = {
                        queryType: "Insert"
                    }
                    if (!CheckDuplicateData($AgencyCode)) {
                        if (myDB.query(strSQL, options)) {
                            alert('บันทึกสำเร็จ!!')
                        }
                    } else {
                        alert('ข้อมูลซ้ำ!!')
                    }

                }


            }

            function CheckDuplicateData($Agent) {
                console.log($Agent);

                var strSQL = "SELECT * FROM tbAgent WHERE AgentCode='" + $Agent + "'"
                if (myDB.query(strSQL)) {
                    return true;
                } else {
                    return false;
                }
            }

            $('.padZero').focusout(function () {
                // format number
                $(this).val(function (index, value) {

                    if (value == '') return "";

                    var max = 10;
                    var result = pad(value, max);
                    return result;

                });

            });

            $('.formDataAgent input').focusout(function () {

                $(this).parent().find('.empty').remove();

                var str = $(this).parent().find('label:eq(0)').text()
                if ($(this).val() != '') {
                    $(this).parent().find('.empty').remove();
                } else {
                    $(this).parent().append("<div class='txt-red empty'>กรุณาระบุข้อมูล " + str
                        .substring(0, str.length - 1) + " !!</div>")
                }

            })

            $(document).on("keypress", "input", function (e) {
                if (e.which === 13) {
                    var index = $('input').index(this) + 1;
                    $('input').eq(index).focus();
                }
            });

            $("#AgencyCode").inputFilter(function (value) {
                return /^\d*$/.test(value);
            });
            $("#AgentCode").inputFilter(function (value) {
                return /^\d*$/.test(value);
            });
        });

        function pad(str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
        }


        $('#fileInput').change(function (e) {

            if ($(this).val() == '') return false;

            $('#wrapper').html("กำลังอ่านไฟล์ ข้อมูล......");

            setTimeout(function () {
                var reader = new FileReader();
                reader.readAsArrayBuffer(e.target.files[0]);

                reader.onload = function (e) {
                    var data = new Uint8Array(reader.result);
                    var wb = XLSX.read(data, {
                        type: 'array'
                    });
                    // console.log(wb);

                    if (wb.Strings.length > 4470) {
                        alert("Upload เกิน 1000 แถว!! \n กรุณาลดจำนวนแถว แล้วโหลดใหม่!");
                        $('#fileInput').val('')
                        return false;
                    }
                    var text;
                    var htmlstr = XLSX.write(wb, {
                        sheet: wb.SheetNames[0],
                        type: 'string',
                        bookType: 'html'
                    });
                    text =
                        '<button id="Insert">Upload data</button><div id="myProgress"><div id="myBar"></div></div><div id="Percent">0%</div>'
                    $('#wrapper').html(text + htmlstr);
                    $('#Insert').show();

                }
            }, 2000)

        });

        // var currentPath = "\\\\thaipwfis02\\OPS-UIRPT\\Service_Center\\ExcelToHTML\\AgentData\\"
        // var myDB = new ACCESSdb(currentPath + "AgentData.mdb", {
        //     showErrors: true
        // });

        (function ($) {
            $.fn.inputFilter = function (inputFilter) {
                return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    } else {
                        this.value = "";
                    }
                });
            };
        }(jQuery));