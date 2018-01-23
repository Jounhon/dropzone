var files,btnTitle;
// ready
$(function() {
    initDropZone();
    initFileInput();
    initUpload();
});

// init drop zone
function initDropZone() {
    var dropzone = $("#dragandrophandler");
    dropzone.on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '2px solid #0B85A1');
    })
    dropzone.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    })
    dropzone.on('dragleave', function(e) {
        $(this).css('border', '0px').css('border-right', '1px solid #ccc');
        e.stopPropagation();
        e.preventDefault();
    })
    dropzone.on('drop', function(e) {
        $(this).css('border', '0px').css('border-right', '1px solid #ccc');
        e.preventDefault();
        var dropFiles = e.originalEvent.dataTransfer.files;

        //We need to send dropped files to Server
        handleFileUpload(dropFiles);
    });

    $(document).on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
    })
    $(document).on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropzone.css('border', '2px dotted #0B85A1');
    })
    $(document).on('dragleave', function(e) {
        dropzone.css('border', '0px').css('border-right', '1px solid #ccc');
        e.stopPropagation();
        e.preventDefault();
    })
    $(document).on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
}

// init file input
function initFileInput() {
    btnTitle = $(".btn-upload-input-title").html();
    $(".btn-upload-input input:file").on("change",function () {

        if( this.files && this.files.length >= 1 ) {
            handleFileUpload(this.files);
        }
        else {
            $("#dragHint").fadeIn();
            $(".btn-upload-input-title").html(btnTitle);
            $("#upload_btn").prop('disabled',true);
        }
    });
}

// handle files
function handleFileUpload(fileList) {
    files = [];
    $("#fileListTable>tbody>tr").remove();
    $.each(fileList, function(i, v) {
        var nameType = v.name.split(".");
        var fileType = nameType[nameType.length - 1].toLowerCase();
        var intSize = v.size;
        var unitSize = FileSizeUnit(v.size);
        var index = v.name.toLowerCase().indexOf("." + fileType);
        var fileName = v.name.substr(0, index);

        $("#fileListTable>tbody").append(
            $("<tr></tr>").attr("data-i", i).css({ 'cursor': 'pointer' })
                .append($("<td></td>").addClass("col-xs-1")
                    .append(
                        $("<span></span>")
                            .attr('id', 'arrow_' + i)
                            .css({ 'color': '#1A936F', 'display': 'block' })
                            .append(
                                $("<i></i>").addClass('icofont icofont-arrow-right').attr('aria-hidden', 'true')
                            )
                    )
                )
                .append($("<td></td>").addClass("col-xs-1").text(i+1))
                .append($("<td></td>").addClass("col-xs-4").text(fileName))
                .append($("<td></td>").addClass("col-xs-1").text(fileType))
                .append($("<td></td>").addClass("col-xs-2").text(unitSize))
                .append(
                    $("<td></td>").addClass("col-xs-3").append(
                        $("<div></div>")
                            .addClass("progress").attr("id", "progressBar_" + i).css({ "margin-bottom": "0px" })
                            .append(
                                $("<div></div>")
                                    .addClass("progress-bar progress-bar-warning progress-bar-striped active")
                                    .attr('role', 'progressbar')
                                    .attr('aria-valuenow', 0)
                                    .attr('aria-valuemin', 0)
                                    .attr('aria-valuemax', 100)
                                    .css({ "width": '0%' })
                                    .append($("<span></span>").attr("id", 'status').text('0%'))
                            )
                    )
                )
        )

        files.push({
            FileName: fileName,
            FisleType: fileType,
            FileSize: intSize,
            Size: unitSize,
            File: v,
        })
    })

    initTrClick();
    $("#upload_btn").prop('disabled',false);
    $(".btn-upload-input-title>i").removeClass("icofont-ui-folder").addClass("icofont-files");
    $(".btn-upload-input-title>span").text("選擇"+files.length+"個檔案");
}

// init tr click
function initTrClick() {
    $('#fileListTable>tbody>tr').click(function () {
        selectIndex = $(this).data('i');
        $("#fileListTable>tbody>tr>td>span").hide();
        $("#arrow_"+selectIndex).show();
    });
    $("#fileListTable>tbody>tr:first").click();
}

// init upload
function initUpload() {
    $("#upload_btn").click(function () {
        $("#upload_btn").prop("disabled",true);
        $("#progressBar_total .progress-bar").removeClass('progress-bar-success').addClass("progress-bar-warning").css("width", "0%");
        $("#progressBar_total").fadeIn();
        progressBar(0);
    })
}

function progressBar(i) {
    if(i==files.length){
        $("#progressBar_total #status").text("上傳成功");
        $("#progressBar_total .progress-bar").toggleClass('progress-bar-warning progress-bar-success');
        return;
    }
    var progress = 0;
    var percent = 0;
    var intervalID = setInterval(function () {
        progress+=Math.floor((Math.random() * 50) + 1);
        percent=Math.ceil(progress/100);
        if(percent>100)
            percent=100;
        var total = Math.ceil( ((i*100)+percent)*100 / (files.length*100) );
        $("#progressBar_total .progress-bar").css("width", total + "%");
        $("#progressBar_total #status").text(total+"%");
        $("#progressBar_"+i+" .progress-bar").css("width",  percent + "%");
        $("#progressBar_"+i+" #status").text(percent + "%");
        if(percent==100) {
            clearInterval(intervalID);
            $("#progressBar_"+i+" #status").text("上傳成功");
            $("#progressBar_"+i+" .progress-bar").toggleClass('progress-bar-warning progress-bar-success');
            setTimeout(function () {
                progressBar(++i);
            },800);
        }
    },16.66);
}

// covert size to size with unit
function FileSizeUnit(fileSize) {
    var unit = ["Bytes", "KB", "MB", "GB", "TB"];
    var flag = 0;
    var size = fileSize;
    while (size >= 1024) {
        size /= 1024;
        flag++;
    }
    return size.toFixed(2) + unit[flag];
}