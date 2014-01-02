(function($)
{
    window.mobileCheck = (function()
    {
        var check = false;

        (function(a)
        {
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
                check = true
        })(navigator.userAgent||navigator.vendor||window.opera);

        return check;
    })();

    // get current URL from where is this script loaded - it's used to append CSS files correctly
    var scripts = document.getElementsByTagName('script'),
        url = scripts[scripts.length - 1].getAttribute('src'),
        bitmonet_url = url.substr(0, url.lastIndexOf('/') + 1),
        head = document.getElementsByTagName('head')[0],
        css = [
            bitmonet_url + 'bitmonet.css',
            bitmonet_url + 'bitmonet_small.css'
        ];

    for(var i in css)
    {
        if (i == 1 && !mobileCheck)
            continue;

        var link = document.createElement('link');
        link.setAttribute('href', css[i]);
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        //link.setAttribute('media', '(max-width: 420px)');
        head.appendChild(link);
    }


    // BitMonet main class
    function BitMonet(params)
    {
        this.animatingTimerWidth = false;
        this.timer = null;
        this.checkModalTimer = null;
        this.invoiceCheckTimer = null;
        this.stopChecking = false;

        this.params = $.extend(true, {}, {
            // header
            company: "The Washington Post",
            heading: "Continue Reading with a Custom Pass",
            logo: false,
            subtitle: "You've read <span class='bitmonet-limit'>15</span> free articles - grab a pass to keep going!",
            useSubtitle: "Activate a pass to keep reading!",
            currency_sign: '$',
            yourOrderText: 'Your Order',

            // payment page
            helpText: 'Login to your Bitcoin wallet to check out',
            usePayPal: 'Or use PayPal',

            // footer
            footerText: "Powered by Bitmonet",
            footerLink: "http://www.bitmonet.com",

            // colors
            buttonColor: '#f7931a',
            buttonTextColor: '#ffffff',

            // purchase options
            optionData: [
                {
                    name: "Article Pass",
                    description: "Read just this article",
                    value: 10,
                    note: "We hope you enjoy your article. Remember not to clear your cookies!",
                    class: "articlePass"
                },
                {
                    name: "Hour Pass",
                    description: "1 hour of unlimited access",
                    value: 15,
                    note: "Please remember not to clear your browser's cookies during this time.",
                    class: "hourPass"
                },
                {
                    name: "Day Pass",
                    description: "All-you-can-read news, all day",
                    value: 20,
                    note: "Please remember not to clear your browser's cookies during this time.",
                    class: "dayPass"
                }
            ],

            // bitpay
            bitpayAPIKey: null,
            bitpayCreatePath: null,
            bitpayCheckPath: null,

            // paypal
            enablePaypal: false,
            paypalEmail: null,
            paypalIPN: 'https://pb-bitmonet.rhcloud.com/paypal/ipn',
            paypalCheckPath: 'https://pb-bitmonet.rhcloud.com/paypal',
            paypalOrderAbove: 0.27,

            // twitter
            enableTweet: false,
            tweetText: '',

            // Modal Settings
            numberClickedNeedBuy: 15,
            articleClickRefreshRate: 7,
            showDelay: 0,

            homeLink: window.location.host,

            // if it should show bitmonet only if tag is present - "<script type="bitmonet"></script>"
            triggerOnTag: false,
            checkForTumblr: false, // if it should check if we are on tumblr post page
            checkForBlogger: false, // check for blogger post page

            // preview mode
            preview: false
        }, params);

        // create invoice URLs for bitpay
        if (this.params.bitpayAPIKey)
            this.params.bitpayCheckPath = this.params.bitpayCreatePath = 'https://pb-bitmonet.rhcloud.com/bitpay/' + this.params.bitpayAPIKey;


        // variables saved to cookies
        var saved = false;
        try
        {
            saved = JSON.parse(this.getCookie('bitmonet-saved'));
        } catch(e) { }

        if (!saved) saved = {};

        this.saved = $.extend({}, {
            // successful purchases
            showThanks: false,
            articleTypeIndex: 0,

            // Require to show the dialog from checking passes?
            requireShowFromCheck: null,

            // set last visited page
            redirectPage: null,

            // invoices
            invoices: [],
            currentInvoice: null,

            // routing
            successURL: null,
            articleUponClick: null
        }, saved);


        // ----- DOM ----- //
        this.bitmonetDomHTML = '\
            <div id="bitmonet-grayOut"></div>\
            <div id="bitmonet-dialog">\
                <div class="bitmonet-relativeWrap">\
                    <div class="close EIEO"></div>\
                    <div class="bitmonet-content">\
                        <div class="bitmonet-header">\
                            <h4>' + this.params.company + '</h4>\
                            ' + (this.params.logo?'<div class="bitmonet-img-logo"><img src="' + this.params.logo + '" /></div>':'<div class="bitmonet-logo"></div>') + '\
                            <p class="bitmonet-heading">' + this.params.heading + '</p>\
                            <p class="bitmonet-subtitle buyPass">\
                                ' + this.params.subtitle + '\
                            </p>\
                        </div>\
                        <div class="bitmonet-purchaseOptions">\
                            <div class="bitmonet-purchaseOption articlePass EIEO">\
                                <div class="bitmonet-icon medium book"></div>\
                                <h5>' + this.params.optionData[0].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.params.optionData[0].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            ' + this.formatPrice(this.params.optionData[0].value) + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div class="bitmonet-purchaseOption hourPass EIEO">\
                                <div class="bitmonet-icon medium clock"></div>\
                                <h5>' + this.params.optionData[1].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.params.optionData[1].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            ' + this.formatPrice(this.params.optionData[1].value) + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div class="bitmonet-purchaseOption dayPass EIEO">\
                                <div class="bitmonet-icon medium happyFace"></div>\
                                <h5>' +  this.params.optionData[2].name + '</h5>\
                                <p class="bitmonet-purchaseDesc">' + this.params.optionData[2].description + '</p>\
                                    <a class="bitmonet-buyLink" target="_blank">\
                                        <div class="bitmonet-button orange EIEO buyPass">\
                                            ' + this.formatPrice(this.params.optionData[2].value) + '\
                                        </div>\
                                    </a>\
                            </div>\
                            <div style="clear: both;"></div>\
                        </div>\
                        <br />\
                        <div class="bitmonet-tweet-link" style="display: ' + (this.params.enableTweet?'block':'none') + '">\
                            <div class="bitmonet-tweet-button"><a href="https://twitter.com/share" class="twitter-share-button" data-lang="en" data-text="' + (this.params.tweetText.length > 0?this.params.tweetText:$('title').text()) + '" data-url="' + location.href + '"></a></div>\
                            <div class="bitmonet-tweet-text">Or tweet this article to read</div>\
                        </div>\
                    </div>\
                </div>\
                <div class="bitmonet-iframe">\
                    <div class="close EIEO"></div>\
                    <div class="bitmonetHeader">\
                        <div class="bitmonet-yourOrder">' + this.params.yourOrderText + '</div>\
                        <div class="bitmonet-passToBuy">\
                            <span class="bitmonet-passType">Article Pass</span>: <span class="bitmonet-passPrice">$0.15</span>\
                        </div>\
                    </div>\
                    <div class="bitmonetHelpLine">\
                        ' + this.params.helpText + '\
                    </div>\
                    <div class="bitmonet-payment-area">\
                        <div class="bitmonet-iframe-overflow">\
                            <iframe id="bitmonet-iframe" noscroll frameborder="0" border="0" src=""></iframe>\
                        </div>\
                        <div class="bitmonet-bitpay-alternative bitmonet-purchaseOption EIEO">\
                            <a class="bitmonet-buyLink bitmonet-bitpay-link">\
                                <div class="bitmonet-button orange EIEO">\
                                    Pay with Bitcoin\
                                </div>\
                            </a>\
                        </div>\
                        <div class="bitmonet-paypal-link">\
                            <span class="bitmonet-link bitmonet-paypal">' + this.params.usePayPal + '</span>\
                            <form class="bitmonet-paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">\
                                <input type="hidden" name="cmd" value="_xclick" />\
                                <input type="hidden" name="business" value="' + this.params.paypalEmail + '" />\
                                <input type="hidden" name="return" value="' + location.href + '" />\
                                <input type="hidden" name="notify_url" value="' + this.params.paypalIPN + '" />\
                                <input type="hidden" name="amount" value="0.15" />\
                                <input type="hidden" name="item_name" value="Article Pass" />\
                                <input type="hidden" name="item_number" value="0" />\
                                <input type="hidden" name="currency_code" value="USD" />\
                                <input type="hidden" name="invoice" value="12345" />\
                            </form>\
                        </div>\
                        <div class="bitmonet-tweet-link">\
                            <div class="bitmonet-tweet-button"><a href="https://twitter.com/share" class="twitter-share-button" data-lang="en" data-text="' + (this.params.tweetText.length > 0?this.params.tweetText:$('title').text()) + '" data-url="' + location.href + '"></a></div>\
                            <div class="bitmonet-tweet-text">Or tweet this article to read</div>\
                            <script>\
                              window.twttr = (function (d,s,id) {\
                                var t, js, fjs = d.getElementsByTagName(s)[0];\
                                if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;\
                                js.src="//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);\
                                return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });\
                              }(document, "script", "twitter-wjs"));\
                              twttr.ready(function(twttr)\
                              {\
                                twttr.events.bind("tweet", function(e)\
                                {\
                                  window.bitmonetArticlePass();\
                                });\
                              });\
                            </script>\
                            <br style="clear: both;" />\
                        </div>\
                    </div>\
                    <div class="bitmonet-expired">\
                        This transaction has expired. Would you like to \
                        <span class="bitmonet-reTryBitPay bitmonet-link">try again?</span>\
                        <br /><br />\
                        <div class="bitmonet-cancelIframe EIEO">Go Back</div>\
                    </div>\
                    <div class="bitmonet-otherWindow">\
                        The payment is pending in another window. \
                        <br /><br />Please check back after you are done paying.\
                        <br /><br />\
                        <div class="bitmonet-cancelIframe EIEO">Go Back</div>\
                    </div>\
                    <div class="bitmonet-cancelIframe EIEO">Cancel</div>\
                </div>\
                <div class="bitmonet-thankYou">\
                    <div class="close EIEO"></div>\
                    <h4 class="bitmonet-thanksTitle">\
                        Thank you for purchasing a<span class="bitmonet-passType">n Article Pass</span>!\
                    </h4>\
                    <p>\
                        <span class="bitmonet-passNote">' + this.params.optionData[2].note + '</span> \
                        <br /> <br />\
                        If you have any questions, please call us at 1-800-477-4679.\
                    </p>\
                    <div class="bitmonet-thanksContinue EIEO">Continue</div>\
                </div>\
                <div class="bitmonet-footer">\
                    <a href="' + this.params.footerLink + '" target="_blank">' + this.params.footerText + '</a>\
                </div>\
            </div>\
            <div id="bitmonet-timer" class="">\
                <div class="bitmonet-timerIcon EIEO"></div>\
                <div class="bitmonet-timerDescription">\
                    <div class="bitmonet-timerTime">\
                        <span class="bitmonet-hours bitmonet-timeNumber">0</span>\
                        <span class="bitmonet-timeSeparator">:</span>\
                        <span class="bitmonet-minutes bitmonet-timeNumber">00</span>\
                        <span class="bitmonet-timeSeparator">:</span>\
                        <span class="bitmonet-seconds bitmonet-timeNumber">00</span>\
                    </div>\
                    <div class="bitmonet-passType"></div>\
                </div>\
                <div class="bitmonet-timerToggle show EIEO">^</div>\
                <div style="clear: both;"></div>\
            </div>';


        // output custom stylesheet for buttons
        $('<style></style>').text('\
            .bitmonet-purchaseOption .bitmonet-button.orange, .bitmonet-thanksContinue {\
                background-color: ' + this.params.buttonColor + ' !important;\
                color: ' + this.params.buttonTextColor + ' !important;\
            }\
            .bitmonet-purchaseOption .bitmonet-button.orange:hover, .bitmonet-thanksContinue:hover {\
                background-color: ' + this.setColorBrightness(this.params.buttonColor, 40) + ' !important;\
                color: ' + this.params.buttonTextColor + ' !important;\
            }\
        ').appendTo($('body'));


        // get currently tracked articles
        try
        {
            this.articlesTracked = JSON.parse(this.getCookie('bitmonet-articlesTracked'));
        }
        catch(e)
        {
            this.articlesTracked = false;
        }

        if (!this.articlesTracked) this.articlesTracked = {};

        this.initialize();
    }

    // ----- Main Methods ----- //

    BitMonet.prototype.formatPrice = function(value)
    {
        return this.params.currency_sign + (parseFloat(value) / 100).toFixed(2);
    }

    BitMonet.prototype.setColorBrightness = function(color, diff)
    {
        var rgb = [],
            c = $.trim(color);

        if (c.length != 7)
            return $c;

        for(var i = 1; i < c.length; i+=2)
            rgb.push(c[i] + c[i+1]);

        for(var i in rgb)
        {
            var dec = parseInt(rgb[i], 16);

            if (diff >= 0)
                dec += diff;
            else
                dec -= abs(diff);

            var hex = Math.max(0, Math.min(255, dec)).toString(16);
            rgb[i] = hex.length == 1?'0':'' + hex;
        }

        return '#' + rgb.join('');
    }

    BitMonet.prototype.initialize = function()
    {
        // check if it should show the dialog
        if (this.params.triggerOnTag)
        {
            // don't show if there is not our tag
            if ($('script[type=bitmonet]').length == 0)
                return;

            var url = location.href;

            // don't show when we are not on post page of tumblr or blogger
            if (this.params.checkForTumblr && !/\/post\/\d+\/.+/.test(url))
                return;

            if (this.params.checkForBlogger && !/\/\d+\/\d+\/.+/.test(url))
                return;
        }


        var self = this, $body = $('body');

        $body.append(this.bitmonetDomHTML);

        $('#bitmonet-grayOut').css('display', 'none');
        $('#bitmonet-dialog').css('display', 'none');


        // Set limit number
        $('.bitmonet-limit').text(this.params.numberClickedNeedBuy);

        // custom tweet link action
        $('.bitmonet-tweet-text').on('click', function()
        {
            //self.openWindow('https://twitter.com/share?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent($('title').text()) + '&', 550, 450)
        });

        /* ----- Dialog Closing ----- */

        // To close dialog
        $('#bitmonet-dialog .close').on('click', function()
        {
            // remove invoices if dialog was closed
            self.saved.invoices = [];
            self.saved.currentInvoice = null;
            self.saveVars();
            self.stopChecking = true;

            self.checkThanksAndReverse();

            if (!self.saved.requireShowFromCheck || self.params.preview)
            {
                $('body').css({
                    'width': 'inherit',
                    'height': 'inherit',
                    'position': 'inherit',
                    'overflow': 'visible'
                });

                $('#bitmonet-grayOut').fadeOut();
                $('#bitmonet-dialog').fadeOut();

                if (self.params.preview)
                {
                    $('#bitmonet-grayOut').remove();
                    $('#bitmonet-dialog').remove();
                    $('#bitmonet-timer').remove();

                    // remove twitter stuff
                    $('body').attr('data-twttr-rendered', false);
                    $('#twttrHubFrameSecure').remove();
                    $('#twttrHubFrame').remove();
                    $('#LR1').remove();
                    $('#twitter-wjs').remove();
                }
            }
            else
            {
                if (!self.articlesTracked[self.saved.redirectPage])
                    self.saved.redirectPage = null;

                window.location = self.saved.redirectPage || self.params.homeLink;
            }
        });

        // Close dialog upon ESC keypress
        $(document).keyup(function (e)
        {
            if (e.which == '27')
                $('#bitmonet-dialog .close').trigger('click');
        });

        // Clicking outside modal
        $(document).click(function(e)
        {
            var dialogShowing = $('#bitmonet-dialog').is(':visible'),
                notDialog = $(e.target).attr('id') != "bitmonet-dialog",
                notChildOfDialog = $(e.target).parents('#bitmonet-dialog').length <= 0;

            if (dialogShowing && notDialog && notChildOfDialog)
                $('#bitmonet-dialog .close').trigger('click');
        });

        // When not mobile, make sure div always centered
        $(window).resize(function()
        {
            self.check_body_padding_set_overlay();
            //self.set_bmd_position();
        });

        // When timer hovered, move it up
        $('#bitmonet-timer').on('mouseover', function()
        {
            if (!self.animatingTimerWidth && !$(this).hasClass('timer-clicked')) {
                $(this).stop().animate({
                    'bottom': '-1px',
                }, 'fast');
            }
        }).on('mouseout', function()
        {
            if (!self.animatingTimerWidth && !$(this).hasClass('timer-clicked')) {
                $(this).stop().animate({ 'bottom': '-10px' }, 'fast');
            }
        });

        // Timer Show/Hide
        $('#bitmonet-timer').on('click', function()
        {
            if ($(this).hasClass('timer-clicked'))
            {
                $(this).find('.bitmonet-timerDescription').fadeOut('fast', function() {
                    self.animatingTimerWidth = true;
                    $('#bitmonet-timer').stop().animate({
                        'width': '60px',
                        'bottom': '-10px'
                    }, 'normal', function()
                    {
                        self.animatingTimerWidth = false;
                        $(this).find('.bitmonet-timerToggle').text("^");
                    });
                });

                $(this).removeClass('timer-clicked');
            }
            else
            {
                self.animatingTimerWidth = true;
                $(this).animate({
                    'width': '132px',
                    'bottom': '-1px'
                }, 'normal', function()
                {
                    $(this).find('.bitmonet-timerDescription').fadeIn();
                    self.animatingTimerWidth = false;
                    $(this).find('.bitmonet-timerToggle').text("x");
                });

                $(this).addClass('timer-clicked');
            }
        });

        // Removing thanks view DOM until required
        $('.bitmonet-thankYou .bitmonet-thanksContinue').on('click', function()
        {
            if (!self.saved.requireShowFromCheck)
                $('#bitmonet-dialog .close').trigger('click');
            else
            {
                self.checkThanksAndReverse();
                return false;
            }
        });

        // Interrupt Payment Buy click, don't allow target _blank
        $('.bitmonet-purchaseOption > .bitmonet-buyLink').on('click', function()
        {
            var articleIndex = $(this).parent().index();

            self.setupPayment(articleIndex);
            self.createInvoice(self.params.optionData[articleIndex].value / 100);
        });

        // when is clicked on paypal link
        $('.bitmonet-paypal').on('click', function()
        {
            $('.bitmonet-paypal-form').submit();
        });

        // Clicking cancel or go back on bitpay iframe
        $('.bitmonet-cancelIframe').on('click', function()
        {
            // we should clear all invoice
            self.saved.invoices = [];
            self.saved.currentInvoice = null;
            self.saveVars();
            self.stopChecking = true;

            $('.bitmonet-iframe:visible, .bitmonet-otherWindow:visible').fadeOut('normal', function() {
                $('.bitmonet-relativeWrap').show();
            });
        });

        // Clicking retry button
        $('.bitmonet-reTryBitPay').on('click', function()
        {
            self.createInvoice(self.params.optionData[self.saved.articleTypeIndex].value / 100);
        });


        var path = window.location.pathname,
            successURL = this.saved.successURL || this.params.homeLink;


        // save permanent data on unload
        $(window).on('unload', function()
        {
            if (self.params.preview)
                return;

            self.saved.redirectPage = location.href;
            self.saved.currentInvoice = null;
            self.saveVars();
        });

        if (this.params.preview)
        {
            this.show();
            return;
        }


        // Check if successs page, create passes
        if (path.indexOf(successURL) !== -1)
        {
            var query = unescape(window.location.search.split("?")[1]);

            var queryValueKey = "&order[total_native][cents]";
            var foundIndex = query.indexOf(queryValueKey);

            // If this is not returning parameters of what is paid
            if (foundIndex == -1)
                return;

            var valueIndex = foundIndex + queryValueKey.length + 1;
            var endIndex = query.indexOf("&", valueIndex + queryValueKey.length + 1);
            endIndex = endIndex === -1 ? query.length - 1 : endIndex;

            var queryValue = parseFloat(query.substring(valueIndex, endIndex));

            var passLink = this.saved.articleUponClick;

            this.setPass(queryValue, passLink);
        }

        // Check to see if any passes have cleared
        for (var i in this.saved.invoices)
            if (this.saved.invoices[i] != this.saved.currentInvoice)
                this.checkInvoiceStatus(this.saved.invoices[i]);

        // Show the outstanding invoice
        if (this.saved.currentInvoice != null)
            this.checkInvoiceStatus(this.saved.currentInvoice, true);

        // track article
        this.saved.articleUponClick = path;

        // Check if need pass
        var numTracked = Object.keys(this.articlesTracked).length,
            freeOver = numTracked >= this.params.numberClickedNeedBuy || this.params.numberClickedNeedBuy < 1,
            hasPass = this.checkPassesAndSetTimer();

        if (!this.articlesTracked[path] && numTracked < this.params.numberClickedNeedBuy)
        {
            this.articlesTracked[path] = true;
            this.setCookie('bitmonet-articlesTracked', JSON.stringify(this.articlesTracked), 365);
        }

        if (freeOver && !hasPass && !this.articlesTracked[path])
        {
            if (self.params.showDelay > 0)
            {
                window.setTimeout(function()
                {
                    self.show();
                    self.saved.requireShowFromCheck = true;
                }, self.params.showDelay * 1000);
            }
            else
            {
                self.show();
                self.saved.requireShowFromCheck = true;
            }
        }
        else
            self.saved.requireShowFromCheck = false;

        // Check if thankyou page is needed to be shown
        if (this.saved.showThanks)
            this.showThankYouDom();

        // tweet article pass
        window.bitmonetArticlePass = function()
        {
            var index = self.saved.invoices.indexOf(self.saved.currentInvoice);

            if (index !== -1)
                self.saved.invoices.splice(index, 1);

            self.saved.currentInvoice = null;

            self.setPass(self.params.optionData[0].value);
            self.checkPassesAndSetTimer();
            self.saved.requireShowFromCheck = false;
            self.saveVars();
            self.showThankYouDom(true);
        }
    }

    // open popup window
    BitMonet.prototype.openWindow = function(url, width, height)
    {
        var left = (screen.width - width) / 2,
            top = (screen.height - height) / 2;

        window.open(url, null, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
    }

    // prepare payment info
    BitMonet.prototype.setupPayment = function(articleIndex)
    {
        if (typeof articleIndex === 'undefined')
            articleIndex = this.saved.articleTypeIndex;
        else
        {
            this.saved.articleTypeIndex = articleIndex;
            this.saveVars();
        }

        if (typeof articleIndex === 'undefined')
            return;

        var passType = this.params.optionData[articleIndex].name,
            passPrice = this.params.optionData[articleIndex].value,
            $bitmonet_iframe = $('.bitmonet-iframe');

        $('.bitmonet-passType', $bitmonet_iframe).text(passType);
        $('.bitmonet-passPrice', $bitmonet_iframe).text(this.formatPrice(passPrice));

        // update paypal info
        if (passPrice / 100 > this.params.paypalOrderAbove && this.params.enablePaypal &&
            this.params.paypalEmail && !(this.params.enableTweet && articleIndex == 0))
        {
            $('.bitmonet-paypal-link').show();
            var $form = $('.bitmonet-paypal-form');

            $('input[name=amount]', $form).val(passPrice / 100);
            $('input[name=item_name]', $form).val(passType);
            $('input[name=item_number]', $form).val(articleIndex);
        }
        else
            $('.bitmonet-paypal-link').hide();

        // show tweet option
        if (this.params.enableTweet && articleIndex == 0)
            $('.bitmonet-iframe .bitmonet-tweet-link').show();
        else
            $('.bitmonet-iframe .bitmonet-tweet-link').hide();
    }


    // show bitmonet modal dialog
    BitMonet.prototype.show = function()
    {
        this.check_body_padding_set_overlay();
        //this.set_bmd_position();

        $('#bitmonet-grayOut').fadeIn();
        $('#bitmonet-dialog').fadeIn();

        // When modal is active, no need to scroll
        if (!this.params.preview)
        {
            $('body').css({
                'width': '100%',
                'height': '100%',
                'position': 'fixed',
                'overflow': 'hidden'
            });
        }
    }

    BitMonet.prototype.showThankYouDom = function(fade)
    {
        if (fade && $('.bitmonet-iframe').is(":visible")) {
            $('.bitmonet-iframe').fadeOut('normal', function() {
                $('.bitmonet-thankYou').show();
            });
        } else if (fade) {
            $('.bitmonet-relativeWrap').fadeOut('normal', function() {
                $('.bitmonet-thankYou').show();
            });
        } else {
            $('.bitmonet-relativeWrap').hide();
            $('.bitmonet-thankYou').show();
        }

        var articleTypeIndex = this.saved.articleTypeIndex,
            passType = this.params.optionData[articleTypeIndex].name;

        if (articleTypeIndex == 0 || articleTypeIndex == 1)
            passType = "n " + passType;
        else
            passType = " " + passType;

        $('.bitmonet-thankYou .bitmonet-passType').text(passType);
        $('.bitmonet-thankYou .bitmonet-passNote').text(this.params.optionData[articleTypeIndex].note);

        $('.bitmonet-thankYou h4').addClass(this.params.optionData[articleTypeIndex].class);

        this.show();
    }

    BitMonet.prototype.reverseThankYouDom = function()
    {
        $('.bitmonet-thankYou').fadeOut('normal', function() {
            $('.bitmonet-relativeWrap').fadeIn();
        });
    }

    BitMonet.prototype.checkThanksAndReverse = function()
    {
        if (this.saved.showThanks)
        {
            this.reverseThankYouDom();
            this.saved.showThanks = false;
            this.saveVars();
        }
    }

    BitMonet.prototype.createInvoice = function(price)
    {
        var source = "";
        var self = this;

        $.ajax({
            type: "GET",
            url: self.params.bitpayCreatePath,
            data: {"price": price, "currency": "USD", 'redirect': location.href},
            dataType: "jsonp",
            success: function(result)
            {
                if (typeof result !== 'object' || !result.hasOwnProperty('id'))
                {
                  //  alert('An error occurred, please try again later.');
                    return;
                }

                // delete old invoice if there is some (can be expired)
                if (self.saved.currentInvoice != null)
                {
                    var index = self.saved.invoices.indexOf(self.saved.currentInvoice);

                    if (index !== -1)
                        self.saved.invoices.slice(index, 1);
                }

                if (self.saved.invoices.indexOf(result.id) === -1)
                    self.saved.invoices.push(result.id);

                self.saved.currentInvoice = result.id;
                self.saveVars();

                // if it's a mobile device
                //if ($(window).width() < 420)
                if (mobileCheck)
                    $('.bitmonet-bitpay-link').attr('href', result.url);
                else
                {
                    source = result.url + '&view=iframe';
                    $('.bitmonet-iframe').find('iframe').first().attr('src', source);
                }

                $('.bitmonet-relativeWrap').hide();
                $('.bitmonet-expired').hide();
                $('.bitmonet-otherWindow').hide();
                $('.bitmonet-iframe').show();
                $('.bitmonet-payment-area').show();
                $('#bitmonet-iframe').show();
                $('.bitmonet-iframe .bitmonet-cancelIframe').show();

                // set invoice id to paypal form
                $('.bitmonet-paypal-form input[name=invoice]').val(result.id);

                self.checkInvoiceStatus(result.id);
            },
            error: function()
            {
             //   alert('An error occurred, please try again later.');
            }
        });
    }


    // ----- Helper Functions ----- //
    BitMonet.prototype.set_bmd_position = function()
    {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            windowMobile = windowWidth <= 420;

        if (mobileCheck)
        {
            $('#bitmonet-dialog').css('top', '0px');
            $('#bitmonet-dialog').css('left', '0px');
            return;
        }

        var bmHeight = 471;
        var bmWidth = 702;

        if ($('#bitmonet-dialog').is(":visible"))
        {
            bmHeight = $('#bitmonet-dialog').outerHeight();
            bmWidth = $('#bitmonet-dialog').outerWidth();
        }

        var bmTop = windowHeight / 2 - bmHeight / 2;
        bmTop = bmTop < 0 ? 0 : bmTop;
        var bmLeft = windowWidth / 2 - bmWidth / 2;
        bmLeft = bmLeft < 0 ? 0 : bmLeft;

        $('#bitmonet-dialog').css('top', bmTop + 'px');
        $('#bitmonet-dialog').css('left', bmLeft + 'px');
    };

    BitMonet.prototype.check_body_padding_set_overlay = function()
    {
        if (mobileCheck)
            return;

        var top = this.get_number_from_px($('body').css('margin-top'));
        var bottom = this.get_number_from_px($('body').css('margin-bottom'));
        var left = this.get_number_from_px($('body').css('margin-left'));
        var right = this.get_number_from_px($('body').css('margin-right'));

        $('#bitmonet-grayOut').css('top', '-' + top + 'px');
        $('#bitmonet-grayOut').css('left', '-' + left + 'px');
        $('#bitmonet-grayOut').css('width', $(document).width() + right + 'px');
        $('#bitmonet-grayOut').css('height', $(document).height() + bottom + 'px');
    };

    BitMonet.prototype.get_number_from_px = function(string)
    {
        var index = string.indexOf('px');
        return parseInt(string.substring(0, index));
    };

    BitMonet.prototype.encrypt = function(str)
    {
        var b = '';
        for(var i = 0; i < str.length; i++)
            b += String.fromCharCode(69 ^ str.charCodeAt(i));

        return b;
    }

    BitMonet.prototype.decrypt = function(str)
    {
        var b = '';
        for(var i = 0; i < str.length; i++)
            b += String.fromCharCode(69 ^ str.charCodeAt(i));

        return b;
    }

    // ----- Cookies ----- //
    BitMonet.prototype.setCookie = function(name, value, days)
    {
        var exp_date = new Date();
        exp_date.setDate(exp_date.getDate() + days);

        value = escape(this.encrypt(value)) + (days == null?'':'; expires=' + exp_date.toUTCString()) + '; path=/';
        document.cookie = name + "=" + value
    }

    BitMonet.prototype.getCookie = function(name)
    {
        var cookies = document.cookie.split(';');

        for(var i in cookies)
        {
            var cook = cookies[i];

            x = cook.substr(0, cook.indexOf('='));
            y = cook.substr(cook.indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if(x == name)
                return this.decrypt(unescape(y));
        }

        return false;
    }


    BitMonet.prototype.checkPassesAndSetTimer = function()
    {
        var href = window.location.href;

        // Check if day pass
        var dayPasses = false;

        try
        {
            dayPasses = JSON.parse(this.getCookie('bitmonet-dayPasses'));
        } catch(e) { }

        if (!dayPasses) dayPasses = [];

        var foundActiveDayPass = false;
        var firstDayPassLocation = -1;
        var deletedPasses = [];

        for (var dayPass in dayPasses)
        {
            var pass = dayPasses[dayPass];
            if (pass.activated)
            {
                var hourDiff = (new Date() - new Date(pass.start)) / 1000 / 60 / 60;
                if (hourDiff >= 24)
                {
                    // Mark old activated passes for removal
                    deletedPasses.push(dayPass);
                }
                else if (!foundActiveDayPass)
                {
                    foundActiveDayPass = true;

                    // Turn on Timer
                    var expiry = new Date(pass.start);
                    expiry.setHours(expiry.getHours() + 24);
                    this.setTimer(expiry);

                    return true;
                } else if (foundActiveDayPass)
                {
                    // Turn off multiple activated ones if time is still available
                    dayPasses[dayPass].activated = false;
                }
            } else if (firstDayPassLocation == -1)
            {
                firstDayPassLocation = dayPass;
            }
        }

        // Remove tagged unused passes
        for (var i = deletedPasses.length - 1; i >= 0; i--) {
            // If unused passes are plucked before the first avilable, update
            if (deletedPasses[i] < firstDayPassLocation) {
                firstDayPassLocation--;
            }
            dayPasses.splice(deletedPasses[i], 1);
        }

        if (dayPasses)
            this.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);

        // -- If no day pass, check for hour pass -- //

        var hourPasses = false;

        try
        {
            hourPasses = JSON.parse(this.getCookie('bitmonet-hourPasses'));
        } catch(e) { }

        if (!hourPasses) hourPasses = [];

        var foundActiveHourPass = false;
        var firstHourPassLocation = -1;
        deletedPasses = [];

        for (var hourPass in hourPasses)
        {
            var pass = hourPasses[hourPass];
            if (pass.activated) {
                var hourDiff = (new Date() - new Date(pass.start)) / 1000 / 60 / 60;
                if (hourDiff >= 1)
                {
                    // Mark old activated passes for removal
                    deletedPasses.push(hourPass);
                }
                else if (!foundActiveHourPass && !foundActiveDayPass)
                {
                    foundActiveHourPass = true;

                    var expiry = new Date(pass.start);
                    expiry.setHours(expiry.getHours() + 1);
                    this.setTimer(expiry);

                    return true;
                }
                else if (foundActiveHourPass)
                {
                    // Turn off multiple activated ones if time is still available
                    hourPasses[hourPass].activated = false;
                }
            }
            else if (firstHourPassLocation == -1)
            {
                firstHourPassLocation = hourPass;
            }
        }
        // Remove tagged unused passes
        for (var i = deletedPasses.length - 1; i >= 0; i--)
        {
            // If unused passes are plucked before the first avilable, update
            if (deletedPasses[i] < firstHourPassLocation)
                firstHourPassLocation--;

            hourPasses.splice(deletedPasses[i], 1);
        }

        if (hourPasses)
            this.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);


        // -- Check for article passes -- //
        var articlePasses = false;

        try
        {
            articlePasses = JSON.parse(this.getCookie('bitmonet-articlePasses'));
        } catch(e) { }

        if (!articlePasses) articlePasses = [];

        var foundActiveArticlePass = false;
        var firstArticlePassLocation = -1;

        for (var articlePass in articlePasses)
        {
            var pass = articlePasses[articlePass];

            if (pass.link == href)
            {
                if (!pass.activated)
                    pass.activated = true;

                // TODO TESTING check if artical passes has updated
                this.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);
                foundActiveArticlePass = true;

                return true;
            }
            else if ((!pass.activated || !pass.link) && firstArticlePassLocation == -1)
                firstArticlePassLocation = articlePass;
        }

        // If no active passes are found, find one to use
        if (!foundActiveDayPass && !foundActiveHourPass && !foundActiveArticlePass)
        {
            // Check to see if any passes are free, use them
            if (firstDayPassLocation != -1)
            {
                dayPasses[firstDayPassLocation].start = new Date();
                dayPasses[firstDayPassLocation].activated = true;

                foundActiveDayPass = true;

                // Turn on Timer
                var expiry = new Date(dayPasses[firstDayPassLocation].start);
                expiry.setHours(expiry.getHours() + 24);
                this.setTimer(expiry);

                // Save article pass state to cookie
                this.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);

                return true;
            }
            else if (firstHourPassLocation != -1)
            {
                hourPasses[firstHourPassLocation].start = new Date();
                hourPasses[firstHourPassLocation].activated = true;

                foundActiveHourPass = true;

                // Turn on Timer
                var expiry = new Date(hourPasses[firstHourPassLocation].start);
                expiry.setHours(expiry.getHours() + 1);
                this.setTimer(expiry);

                // Save article pass state to cookie
                this.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);

                return true;
            }
            else if (firstArticlePassLocation != -1)
            {
                if (!this.saved.articleUponClick)
                {
                    alert('wtf?');
                    debugger;
                }

                articlePasses[firstArticlePassLocation].link = this.saved.articleUponClick;
                articlePasses[firstArticlePassLocation].activated = true;

                foundActiveArticlePass = true;

                // Save article pass state to cookie
                this.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);

                return true;
            }
            else
                return false;
        }

        return (foundActiveDayPass || foundActiveHourPass || foundActiveArticlePass);
    }

    BitMonet.prototype.setPass = function(passPrice, passLink)
    {
        // Check which type of pass was bought, set it accordingly
        if (passPrice == this.params.optionData[0].value)
        {
            // -- Article Pass -- //

            // Create and Add new pass
            var articlePasses = false;

            try
            {
                articlePasses = JSON.parse(this.getCookie('bitmonet-articlePasses'));
            } catch(e) { }

            if (!articlePasses) articlePasses = [];

            var newPass = {
                link: window.location.href,
                activated: false
            };

            articlePasses.push(newPass);

            // Save article pass state to cookie
            this.setCookie('bitmonet-articlePasses', JSON.stringify(articlePasses), 365);

            this.saved.showThanks = true;
            this.saved.articleTypeIndex = 0;

            this.saveVars();

            // If requires redirect, do it
            if (passLink !== undefined)
                window.location = passLink || bitmonet.homeLink;

        }
        else if (passPrice == this.params.optionData[1].value)
        {
            // -- Hour Pass -- //

            // Create and Add new pass
            var hourPasses = false;

            try
            {
                hourPasses = JSON.parse(this.getCookie('bitmonet-hourPasses'));
            } catch(e) { }

            if (!hourPasses) hourPasses = [];

            var newPass = {
                start: new Date(),
                activated: false
            };

            hourPasses.push(newPass);

            // Save article pass state to cookie
            this.setCookie('bitmonet-hourPasses', JSON.stringify(hourPasses), 365);

            this.saved.showThanks = true;
            this.saved.articleTypeIndex = 1;

            this.saveVars();

            // If requires redirect, do it
            if (passLink !== undefined)
                window.location = passLink || this.params.homeLink;

        }
        else if (passPrice == this.params.optionData[2].value)
        {
            // -- Day Pass -- //

            // Create and Add new pass
            var dayPasses = false;

            try
            {
                dayPasses = JSON.parse(this.getCookie('bitmonet-dayPasses'));
            } catch(e) { }

            if (!dayPasses) dayPasses = [];

            var newPass = {
                start: new Date(),
                activated: false
            }

            dayPasses.push(newPass);

            // Save article pass state to cookie
            this.setCookie('bitmonet-dayPasses', JSON.stringify(dayPasses), 365);

            this.saved.showThanks = true;
            this.saved.articleTypeIndex = 2;

            this.saveVars();

            // If requires redirect, do it
            if (passLink !== undefined)
                window.location = passLink || this.params.homeLink;

        }
        else
            alert('something went wrong! This pass doesn\'t exist');
    }

    BitMonet.prototype.setTimer = function(timeLeft)
    {
        clearTimeout(this.timer);

        var diff = timeLeft - (new Date()),
            self = this,
            hours = 0,
            minutes = 0,
            seconds = 0;

        if (diff >= 0)
        {
            var hours = Math.floor(diff / 1000 / 60 / 60);
            diff -= hours * 1000 * 60 * 60;

            var minutes = Math.floor(diff / 1000 / 60);
            diff -= minutes * 1000 * 60;

            var seconds = Math.floor(diff / 1000);
            diff -= seconds * 1000;
        }

        hours = hours < 10 ? '0' + hours : hours;
        $('#bitmonet-timer .bitmonet-hours').text(hours);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        $('#bitmonet-timer .bitmonet-minutes').text(minutes);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        $('#bitmonet-timer .bitmonet-seconds').text(seconds);

        // If timer is visible, show it
        if (!$('#bitmonet-timer').hasClass('timer-visible'))
        {
            $('#bitmonet-timer').addClass('timer-visible');
            $('#bitmonet-timer').show().stop().animate({
                'bottom': '-5px'
            });
        }

        if ((timeLeft - (new Date())) / 1000 > 0)
        {
            this.timer = setTimeout(function() {
                self.setTimer(timeLeft);
            }, 1000);
        }
        else
        {
            // Out of time, check if need pass
            if ($('#bitmonet-timer').hasClass('timer-visible'))
            {
                $('#bitmonet-timer').removeClass('timer-visible');
                $('#bitmonet-timer').stop().animate({
                    'bottom': '-62px'
                }, function()
                {
                    $(this).hide();
                });
            }

            clearTimeout(this.timer);

            var numTracked = Object.keys(this.articlesTracked).length,
                freeOver = numTracked > this.params.numberClickedNeedBuy || this.params.numberClickedNeedBuy < 1,
                hasPass = this.checkPassesAndSetTimer();

            if (freeOver && !hasPass)
            {
                this.show();
                this.saved.requireShowFromCheck = true;
            }
            else
                this.saved.requireShowFromCheck = false;

        }
    }

    BitMonet.prototype.checkPayPalInvoiceStatus = function(id, callback)
    {
        // check for paypal payment
        if (!this.params.enablePaypal || !this.params.paypalEmail)
        {
            callback.call(this);
            return;
        }

        var self = this;

        $.ajax({
            type: "GET",
            url: this.params.paypalCheckPath,
            data: {"id": id},
            dataType: "jsonp",
            error: function()
            {
                callback.call(this);
            },
            success: function(result)
            {
                if (typeof result !== 'object' || !result.hasOwnProperty('status'))
                {
                    callback.call(this);
                    return;
                }

                if (result.status == 1)
                {
                    // If this is a cached invoice, remove it
                    if (jQuery.inArray(result.id, self.saved.invoices) != -1)
                    {
                        self.saved.invoices.splice(jQuery.inArray(result.id, self.saved.invoices), 1);
                        self.saveVars();
                    }

                    // UN-set checking of invoice, not required anymore.
                    if (self.saved.currentInvoice != null)
                    {
                        self.saved.currentInvoice = null;
                        self.saveVars();
                    }

                    self.setPass(result.price * 100);
                    self.checkPassesAndSetTimer();
                    self.saved.requireShowFromCheck = false;

                    // Sometimes the modal is not shown already. Show.
                    if (!$('#bitmonet-dialog').is(':visible')) { self.show(); }
                    self.showThankYouDom(true);
                }
                else
                    callback.call(this);
            }
        });
    }

    BitMonet.prototype.checkInvoiceStatus = function(id, nocall)
    {
        if (this.stopChecking || this.params.preview)
        {
            this.stopChecking = false;
            return;
        }

        clearTimeout(this.invoiceCheckTimer);
        this.invoiceCheckTimer = null;

        var self = this;

        $.ajax({
            type: "GET",
            url: this.params.bitpayCheckPath,
            data: {"id": id},
            dataType: "jsonp",
            error: function()
            {
                if (self.checkPayPalInvoiceStatus(id))
                    return;

                // if error occurred, try to check again
                if (!self.invoiceCheckTimer)
                    self.invoiceCheckTimer = setTimeout(function()
                    {
                        self.checkInvoiceStatus(id);
                    }, 1000);
            },
            success: function(result)
            {
                self.checkPayPalInvoiceStatus(id, function()
                {
                    if (typeof result !== 'object' || !result.hasOwnProperty('id'))
                    {
                        if (!self.invoiceCheckTimer)
                            self.invoiceCheckTimer = setTimeout(function()
                            {
                                self.checkInvoiceStatus(id);
                            }, 1000);

                        return;
                    }

                    // nocall is to do everything in-page, no call is generally used for non-mobile
                    // triggering the BitPay Payment page in an iframe

                    if (nocall == undefined && result.status == "new")
                    {
                        // If the invoice was just created, keep checking it
                        if (!self.invoiceCheckTimer)
                            self.invoiceCheckTimer = setTimeout(function()
                            {
                                self.checkInvoiceStatus(result.id);
                            }, 1000);
                    }
                    else if (nocall == undefined && result.status == "expired" || result.status == "invalid")
                    {
                        // If for sure the invoice has failed, return them to the regular modal
                        $('.bitmonet-payment-area').hide();
                        $('.bitmonet-expired').show();

                        if (self.saved.currentInvoice != null)
                        {
                            self.saved.currentInvoice = null;
                            self.saveVars();
                        }
                    }
                    else if (result.status == "paid" || result.status == "confirmed" || result.status == "complete")
                    {
                        // -- Completed Invoice -- //

                        // If this is a cached invoice, remove it
                        if (jQuery.inArray(result.id, self.saved.invoices) != -1)
                        {
                            self.saved.invoices.splice(jQuery.inArray(result.id, self.saved.invoices), 1);
                            self.saveVars();
                        }

                        // UN-set checking of invoice, not required anymore.
                        if (self.saved.currentInvoice != null)
                        {
                            self.saved.currentInvoice = null;
                            self.saveVars();
                        }

                        self.setPass(result.price * 100);
                        self.checkPassesAndSetTimer();
                        self.saved.requireShowFromCheck = false;

                        // Sometimes the modal is not shown already. Show.
                        if (!$('#bitmonet-dialog').is(':visible')) { self.show(); }
                        self.showThankYouDom(true);
                    }
                    else
                    if (nocall)
                    {
                        // Show the BitPay Payment page in the iFrame
                        source = result.url + "&view=iframe";

                        $('.bitmonet-iframe').find('iframe').first().attr('src', source);

                        $('.bitmonet-relativeWrap').hide();
                        $('.bitmonet-expired').hide();
                        $('.bitmonet-otherWindow').hide();
                        $('.bitmonet-iframe').show();
                        $('.bitmonet-payment-area').show();
                        $('.bitmonet-iframe .bitmonet-cancelIframe').show();

                        // set invoice id to paypal form
                        $('.bitmonet-paypal-form input[name=invoice]').val(result.id);

                        self.setupPayment();

                        if (!$('#bitmonet-dialog').is(':visible')) { self.show(); }

                        if (!self.invoiceCheckTimer)
                            self.invoiceCheckTimer = setTimeout(function()
                            {
                                self.checkInvoiceStatus(id);
                            }, 1000);
                    }
                });
            }
        });
    }


    BitMonet.prototype.saveVars = function()
    {
        this.setCookie("bitmonet-saved", JSON.stringify(this.saved), 30);
    }


    // extend jquery with BitMonet
    $.extend({
        BitMonet: function(params)
        {
            return new BitMonet(params);
        }
    });

})(jQuery);
