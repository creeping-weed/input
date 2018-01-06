/**
 * Created by 胡国兴 on 2017/12/28.
 */
$(function(){
    //获取复选框对象
    var $checked=$('.checkbox input');
    //获取表单对象
    var $form=$('form');
    //验证码
    var codeNum=null;
    //开始禁用输入框
    disabled();
    //表单校验
    $form.bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '昵称不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6位之间'
                    },
                    regexp: {
                        regexp: /^[\u4e00-\u9fa5]{2,6}$/,
                        message: '用户名必须为纯中文'
                    }
                }
            },
            password1:{
                validators:{
                    notEmpty:{
                        message: '密码不能为空'
                    },
                    stringLength:{
                        min: 8,
                        max: 12,
                        message: '用户名长度必须在8到12位之间'
                    },
                    regexp:{
                        regexp:/^(?=.*?[A-Za-z]+)(?=.*?[0-9]+)(?=.*?[A-Z]).(?=.*?[a-z]).*$/,
                        message:'密码至少有一个大写字母及小写字母与数字成'
                    }
                }
            },
            password2:{
                validators:{
                    notEmpty:{
                        message: '密码不能为空'
                    },
                    callback:{
                        message:'密码不一致'
                    }
                }
            },
            email:{
                validators:{
                    notEmpty:{
                        message: '邮箱不能为空'
                    },
                    regexp:{
                        regexp:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                        message:'请输入正确的邮箱'
                    }
                }
            },
            code:{
                validators:{
                    notEmpty:{
                        message: '验证码不能为空'
                    },
                    callback:{
                        message:'验证码错误'
                    }
                }
            }
        }

    });
    //获取validator实例
    var validator = $form.data('bootstrapValidator');
    //给复选框注册点击事件
    $checked.on('click',function(){
        //判断当前复选框是否勾选
        if($(this).prop('checked')){
            notDisable();
            codeNum=getKode();
        }else{
            notDisable();
            //重置表单，并且会隐藏所有的错误提示和图标
            validator.resetForm();
            disabled();
            //重置表单
            $form[0].reset();
            //验证码清空
            $('.code').children().eq(1).html('');
        }
    });
    //给第二个密码框注册事件
    $('input[name=password2]').on('keyup',function(){
        //获取第一个密码框的密码
        var password1=$('input[name=password1]').val();
        //获取第二个密码框的密码
        var password2=$(this).val();
        //获取表单验证的validator实例
        //var validator = $form.data('bootstrapValidator');
        //当密码不一致的时候
        if(password1!=password2){
            //手动让它校验失败
            validator.updateStatus('password2', 'INVALID', 'callback');
        }
    });
    //给验证码框注册键盘按下事件
    $('input[name=code]').on('keydown',function(e){
        //当回车的时候校验
        if(e.keyCode==13){
            if(parseInt($(this).val())!=codeNum){
                console.log('验证码错误');
                //手动校验失败
                validator.updateStatus('code', 'INVALID', 'callback');
                $(this).attr('disabled',true);
            }
        }

    });
    //给刷新按钮注册点击事件
    $('span.glyphicon-refresh').on('click',function(){
        // 判断是否勾选了用户协议
        if(!$checked.prop('checked')){
            return false;
        }
        codeNum=getKode();
        //获取表单验证的validator实例
        var validator = $form.data('bootstrapValidator');
        $('input[name=code]').attr('disabled',false).val('');
        validator.updateStatus('code', 'NOT_VALIDATED');
    });
    // 动态创建年份
    var year=parseInt(new Date().getFullYear());
    $('#year').append(creatOption(year-10,year-20));
    // 动态创建月份
    $('#month').append(creatOption(12));
    // 动态创建天数
    $('#day').on('focus',function(){
        var year=$('#year').val();
        var month=$('#month').val();
        var day=getDay(year,month);
        $(this).append(creatOption(day));
    });
    //禁止文本框输入函数
    function disabled(){
        $('form input').attr('disabled',true);
        $('form select').attr('disabled',true).css('background-color','#ccc');
    }
    //允许文本框输入函数
    function notDisable(){
        $('form input').attr('disabled',false);
        $('form select').attr('disabled',false).css('background-color','#fff');
    }
    //产生验证码的函数
    function getKode(){
        var resut=null;
        var arr=['+','-','*'];
        //随机获取0-9之间的数字
        function rdm(){
            return Math.floor((Math.random()*9+1));
        }
        var num1=rdm();
        var num2=rdm();
        //随机获取运算符
        var i=arr[Math.floor((Math.random()*arr.length))];
        if(i=='-'){
            if(num1<num2){
                var tmp=null;
                tmp=num1;
                num1=num2;
                num2=tmp;
            }
            resut=num1-num2;
        }else if(i=='*'){
            resut=num1*num2;
        }else {
            resut=num1+num2;
        }
        console.log(num1+i+num2);
        $('.code').children().eq(1).html(num1+i+num2+'=?');
        console.log(resut);
        return resut;
    }
    // 根据年月获取天数
    function getDay(year,month){
        return new Date(parseInt(year),parseInt(month),0).getDate();
    }
    //动态创建option
    function creatOption(num1,num2){
        var html='';
        num2=num2?num2:1;
        for(var i=num2;i<=num1;i++){
            html+='<option>'+i+'</option>';
        }
        return html;
    }
});

