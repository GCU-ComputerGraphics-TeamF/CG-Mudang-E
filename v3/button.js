window.onload = function(){
    var div2 = document.getElementsByClassName("View");
    
          function handleClick(event) {
            console.log(event.target);
            // console.log(this);
            // 콘솔창을 보면 둘다 동일한 값이 나온다
    
            console.log(event.target.classList);
    
            if (event.target.classList[1] === "clicked") {
              event.target.classList.remove("clicked");
            } else {
              for (var i = 0; i < div2.length; i++) {
                div2[i].classList.remove("clicked");
              }
    
              event.target.classList.add("clicked");
            }
          }
    
          function init() {
            for (var i = 0; i < div2.length; i++) {
              div2[i].addEventListener("click", handleClick);
            }
          }
    
          init();
          link = 'index.html'
          $(function () {
            //사용 예시 **************************
            $(document).on("click", "#confirm", function () {
              action_popup.confirm("게임 종료", function (res) {
                if (res) {
                  location.href = link;
                }
              })
            });
          
            
            $(".modal_close").on("click", function () {
              action_popup.close(this);
            });
            //사용 예시 **************************
          });
          
          
          
          /**
           *  alert, confirm 대용 팝업 메소드 정의 <br/>
           *  timer : 애니메이션 동작 속도 <br/>
           *  alert : 경고창 <br/>
           *  confirm : 확인창 <br/>
           *  open : 팝업 열기 <br/>
           *  close : 팝업 닫기 <br/>
           */ 
          var action_popup = {
            timer: 500,
            confirm: function (txt, callback) {
              if (txt == null || txt.trim() == "") {
                console.warn("confirm message is empty.");
                return;
              } else if (callback == null || typeof callback != 'function') {
                console.warn("callback is null or not function.");
                return;
              } else {
                $(".type-confirm .btn_ok").on("click", function () {
                  $(this).unbind("click");
                  callback(true);
                  action_popup.close(this);
                });
                this.open("type-confirm", txt);
              }
            },
          
            alert: function (txt) {
              if (txt == null || txt.trim() == "") {
                console.warn("confirm message is empty.");
                return;
              } else {
                this.open("type-alert", txt);
              }
            },
          
            open: function (type, txt) {
              var popup = $("." + type);
              popup.find(".menu_msg").text(txt);
              $("body").append("<div class='dimLayer'></div>");
              $(".dimLayer").css('height', $(document).height()).attr("target", type);
              popup.fadeIn(this.timer);
            },
          
            close: function (target) {
              var modal = $(target).closest(".modal-section");
              var dimLayer;
              if (modal.hasClass("type-confirm")) {
                dimLayer = $(".dimLayer[target=type-confirm]");
                $(".type-confirm .btn_ok").unbind("click");
              } else if (modal.hasClass("type-alert")) {
                dimLayer = $(".dimLayer[target=type-alert]")
              } else {
                console.warn("close unknown target.")
                return;
              }
              modal.fadeOut(this.timer);
              setTimeout(function () {
                dimLayer != null ? dimLayer.remove() : "";
              }, this.timer);
            }
          }
        }
    