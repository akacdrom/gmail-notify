function gmailchecker()
{
    var old_current = 0;

    chrome.browserAction.onClicked.addListener(function() 
    {
        chrome.tabs.create({
        url: 'https://mail.google.com'});
    });

    gmail_atom_feed= 'https://mail.google.com/mail/u/0/feed/atom/'; //primary: ^smartlabel_personal or ^sq_ig_i_personal
    sound_notification_filepath= '../sounds/effect.wav';  
        
    setInterval(function(){ check(); }, 1000);

    function check()
    {
        xhr = new XMLHttpRequest();
        xhr.open("GET", gmail_atom_feed, true);
        xhr.onreadystatechange = function() 
        {
            var xml = xhr.responseXML;  
            if(xhr.status !== 200)
            { 
                chrome.browserAction.setBadgeText({text:'###'});
                chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
                return;
            }
            
            try {

            var count = xml.getElementsByTagName('fullcount')[0].textContent;
            var mailLink = xml.getElementsByTagName("link")[1].getAttribute("href");
            var autohor = xml.getElementsByTagName('name')[0].textContent;
            var summary = xml.getElementsByTagName('summary')[0].textContent;
            var titleofmail = xml.getElementsByTagName('title')[1].textContent;

            } catch (error) {
              if (count == 0 ) 
              {
                old_current = 0;
              }
              chrome.browserAction.setBadgeText({text: ''});
              return;
             
            }
            if (count > 0) 
            {   
                chrome.browserAction.setBadgeText({text: count});
                chrome.browserAction.setBadgeBackgroundColor({color: 'green'});

                if (count > old_current ) 
                {  
                    soundNotification = new Audio(sound_notification_filepath); 
                    soundNotification.play();
                    chrome.notifications.create
                    (
                        "",
                        {
                            type: "basic",
                            iconUrl: "img/gmail-4.png",
                            title:autohor.toUpperCase()+"\n"+titleofmail+"\n",
                            message:summary,
                        },
                        function () 
                        {
                            chrome.notifications.onClicked.addListener(function() {
                            chrome.tabs.create({
                            url: mailLink});
                            });
                        }
                    );               
                    old_current = count;
                }        
            }
        }
        xhr.send();
    }
}
gmailchecker();
