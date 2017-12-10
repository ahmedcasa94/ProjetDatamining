String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.decapitalize = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
$(document).ready(function() {
    $('.modal').modal();
    var dir = "img/flags/";
    var extension = ".svg";
    $.ajax({
        url : dir,
        success: function (data) {
            var j = 0;
            $(data).find("a").attr("href", function (i, val) {
                if( val.match(/\.(jpe?g|png|gif|svg)$/) ) {
                    var country = val.substr(0,val.indexOf('.')); 
                    $(".country-slider").append( "<div name=\""+country+"\" class=\"center-align\"><img src='"+ dir + val +"' class=\"flag-icon\"></div>" );
                    $(".slider-select").append("<option value=\""+j+"\">"+country.capitalize()+"</option>");
                    j++;
                } 
            });
            $('.country-slider').slick({
                centerMode: true,
                arrows: false,
                focusOnSelect: true,
                centerPadding: '60px',
                slidesToShow: 5,
                responsive: [
                  {
                    breakpoint: 768,
                    settings: {
                      arrows: false,
                      centerMode: true,
                      centerPadding: '40px',
                      slidesToShow: 3
                    }
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      arrows: false,
                      centerMode: true,
                      centerPadding: '40px',
                      slidesToShow: 1
                    }
                  }
                ]
            });
        }
    });
    //home slider
    $('.home-navigate-prev').click(function() {
        $('.home-slider').slick('slickPrev');
    });
    $('.home-navigate-next').click(function() {
        $('.home-slider').slick('slickNext');
    });
    $(".home-select").change( function() {      
        goTo = $(this).val();
        console.log( goTo );
        $('.home-slider').slick( "goTo", goTo);
    });
    $('.home-slider').on('afterChange',function(event, slick, currentSlide){
        $(".home-select").val(currentSlide);
    });
    //away slider
    $('.away-navigate-prev').click(function() {
        $('.away-slider').slick('slickPrev');
    });
    $('.away-navigate-next').click(function() {
        $('.away-slider').slick('slickNext');
    });
    $(".away-select").change( function() {      
        goTo = $(this).val();
        console.log( goTo );
        $('.away-slider').slick( "goTo", goTo);
    });
    $('.away-slider').on('afterChange',function(event, slick, currentSlide){
        $(".away-select").val(currentSlide);
    });
    //change
    $('.country-slider').on('afterChange',function(event,slick,currentSlide) {
        var home = $(".home-select").val();
        var away = $(".away-select").val();
        var button = $('.predict');
        if(home != away)
        {
           button.removeClass("disabled");
        }
        else
        {
           button.addClass("disabled");
        }
    });
    $('.slider-select').change(function() {
        var home = $(".home-select").val();
        var away = $(".away-select").val();
        var button = $('.predict');
        if(home != away)
        {
           button.removeClass("disabled");
        }
        else
        {
           button.addClass("disabled");
        }
    });
    $('.predict').on('click',function() {
        $(this).hide();
        $('.loader').show();
        var home = $(".home-select option:selected").text();
        var away = $(".away-select option:selected").text();
        $.ajax({
            url: 'ProjetDatamining.py',
            type: 'GET',
            data: {
                HT : home,
                AT : away
            },
            dataType: 'text',
            success: function(data) {
                home = home.decapitalize();
                away = away.decapitalize();
                var home_prob = parseFloat(data["home"]);
                var away_prob = parseFloat(data["away"]);
                var draw_prob = parseFloat(data["draw"]);
                $('.modal-content .home-team').append("<img src=\"img/flags/"+home+".svg\" class=\"flag-icon\"/>");
                $('.modal-content .away-team').append("<img src=\"img/flags/"+away+".svg\" class=\"flag-icon\"/>");
                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    title: {
                        text: "Win probability"
                    },
                    data: [{        
                        type: "column",  
                        dataPoints: [      
                            { y: home_prob, label: home.capitalize() },
                            { y: draw_prob,  label: "Draw" },
                            { y: away_prob,  label: away.capitalize() }
                        ]
                    }]
                });
                $('#modal1').modal('open');
                chart.render();
                $('.predict').show();
                $('.loader').hide();

            }
        });
    });
});