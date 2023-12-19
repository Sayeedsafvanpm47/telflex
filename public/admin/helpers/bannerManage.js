// image preview


$(document).ready(function() {
          let imagesPreview = function(input, placeToInsertImagePreview) {
            if (input.files) {
              let filesAmount = input.files.length;
              for (i = 0; i < filesAmount; i++) {
                let reader = new FileReader();
                reader.onload = function(event) {
                  $($.parseHTML("<img>"))
                    .attr("src", event.target.result)
                    .appendTo(placeToInsertImagePreview);
                };
                reader.readAsDataURL(input.files[i]);
              }
            }
          };
          $("#input-images1").on("change", function() {
            imagesPreview(this, "div.preview-images");
          });
          $("#input-images2").on("change", function() {
            imagesPreview(this, "div.preview-images2");
          });
          $("#input-images3").on("change", function() {
            imagesPreview(this, "div.preview-images3");
          });
          $("#input-images4").on("change", function() {
            imagesPreview(this, "div.preview-images4");
          });
          $("#input-images5").on("change", function() {
            imagesPreview(this, "div.preview-images5");
          });
          $("#input-images6").on("change", function() {
            imagesPreview(this, "div.preview-images6");
          });
          $("#input-image7").on("change", function() {
            imagesPreview(this, "div.preview-images7");
          });
          $("#input-images8").on("change", function() {
            imagesPreview(this, "div.preview-images8");
          });
          $("#input-images9").on("change", function() {
            imagesPreview(this, "div.preview-images9");
          });
          $("#input-images10").on("change", function() {
            imagesPreview(this, "div.preview-images10");
          });
          $("#input-images11").on("change", function() {
            imagesPreview(this, "div.preview-images11");
          });
        });
      
        
//         datepicker

jQuery(document).ready(function($) {
          $(".datepicker").datepicker({
              clearBtn: true,
              format: 'yyyy-mm-dd',
              setDate: new Date(),
              autoclose: true
          });
      
          $("#expiry").on("change", function() {
              let selectedDate = $("#expiry").val();
              $("#showupdateDate").text(`Selected Date: ${selectedDate}`);
          });
      });