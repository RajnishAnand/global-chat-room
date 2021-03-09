$(_=>{
   
//To hide loading page when loaded
setTimeout(_=>$('#page-ld').fadeOut(500),500);
$('#tutorial-button').click(_=>$('#tutorial').slideToggle(200));

//Function on click join 
let nameCols=[
    '#ffff00',
    '#00ff00',
    '#00ffff', 
    '#ff77aa',
    '#ff5500'
    ]
const getUserCol=_=>
{return nameCols[Math.round(Math.random()*4) ]};

let user=[Date.now()];
$('#join').click(()=>{
    if($('#term-and')[0].checked){
        miniLoader1(true);
        if($('#username').val().length<1){
            [...'🎩Anonymous'].forEach((i,r)=>{
                setTimeout(_=>{
                    $('#username')[0].value+=i
                },r*50);
            });
            
        };
        setTimeout(_=>goPage2(),1000);
    }
    else{
        alertBox('Please ✅ Tick the  Terms and conditions below.', 'red')
    }
});

//To Enable firebase to get messages
let frb=firebase.database();
function goPage2() {
    user=[$('#username').val(), ...user];
    miniLoader1(false);
    $('#page-ld').fadeIn(100);
    $('#page1').animate({left:'-100%'},0);
    $('#page2').animate({left:'0'}, 0);
    
    frb.ref('mssgs').limitToLast(40).on('child_added',addMsg);
    frb.ref('mssgs').on('child_removed',delMsg);
    setTimeout(_=>$('#page-ld').fadeOut(500),1000);
};

//To send messages on pressing enter key
$('#inp-msg').on('keyup',(ev)=>{
    if(ev.keyCode===13){
        ev.preventDefault();
        $('.send-icon').click();
    };
})

//on send button click
$('.send-icon').click(_=>{
    if($('#inp-msg').val().length==0){return}
    frb.ref('mssgs').push().set({
        'txt':$('#inp-msg').val(),
        'user':user, 
        'tym':getTime()
    });
    $('#inp-msg').val('');
});

let CMsgs=[[],0];
//to add Messages 
function addMsg(_){
    if($(`#${_.key}`).length){return};
    try {
    let imy=(_.val().user[1]==user[1])?'my':'i';
    if(imy=='i'){
        if(CMsgs[0][0]==_.val().user[0]&&CMsgs[0][1]==_.val().user[1]){
            if (CMsgs[1]>6||!CMsgs[1]){
                addUser(CMsgs[0]);
                CMsgs[1]=1;
            }; 
            CMsgs[1]++;
        }
        else{
            CMsgs=[_.val().user,1];
            addUser(CMsgs[0]);
        };
    }else{CMsgs[1]=0;}
    let el0=$(`<div id='${_.key}' class="msg-${imy}"></div>)`)
        .text(_.val().txt);
    let el1= $('<div class="tym-stmp"></div>')
        .text(_.val().tym);
    $(el1).appendTo($(el0));
    $(el0).appendTo($('#msg-disp'));
    $('#msg-disp')[0].scrollTop = $('#msg-disp')[0].scrollHeight+10;
   }catch(err){frb.ref('mssgs/'+_.key).remove()};
};
//To delete messages
function delMsg(_){$(`#${_.key}`).html('<i>This message was deleted.</i>')};


//To scroll to bottom when input is focused
$('#inp-msg').on('focus',_=>setTimeout(_=>$('#msg-disp')[0].scrollTop = $('#msg-disp')[0].scrollHeight+10, 300));

let allUsersCol={};
//To place new User's name & specific color
function addUser(usr){
    let thisUsr=usr.join('-');
    if(allUsersCol[thisUsr]==undefined){
        allUsersCol[thisUsr]=getUserCol();
    }
    let el0=$('<div class="user-i"></div>')
            .text(usr[0])
            .css('color',allUsersCol[thisUsr]);
    $(el0).appendTo($('#msg-disp'));
};



//Returns current time for time stamp
function getTime(){
    let dt= new Date();
    let hr=dt.getHours();
    let min=dt.getMinutes()+"";  
    hr=(hr==0)?12:hr;
    min=(min.length==1)?'0'+min:min;
    let ampm='AM';
    if(hr>12){
        hr-=12;
        ampm='PM';
    }
    return hr+':'+min+ampm;
};

//loading-on-join-click
function miniLoader1(bool){
    if(bool){
        $('#join').css('display','none');
        $('.fetching').css('display','block');
    }
    else{
        $('#join').css('display','block');
        $('.fetching').css('display','none');
    };
};

//for custom alert/popup 
function alertBox(txt,col='#00bfff', pos='top',){
    let a=$('<div class="popup-c"></div>');
    let b=$(`<div class='popup-txt'>${txt}</div>`)
    .prependTo($(a))
    .css({pos:'0','color':col});
    
    $(a).prependTo($('body'));
    setTimeout(_=>{
        $(a).fadeOut(300);
        setTimeout(_=>$(a).remove(),300);
    },3000);
};

});
