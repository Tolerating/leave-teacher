export default{
    path:"/home",
    component:()=>import("@/views/home"),
    children:[ 
        {path:"leaveaudit",component:()=>import("@/views/home/leaveaudit.vue")},
        {path:"weekLeave",component:()=>import("@/views/home/weekLeave.vue")},
        {path:"updatePwd",component:()=>import("@/views/home/updatePwd.vue")},
        {path:"userInfo",component:()=>import("@/views/home/userInfo.vue")},
        {path:"teaImport",component:()=>import("@/views/home/computerFun/teaImport.vue")},
        {path:"stuImport",component:()=>import("@/views/home/computerFun/stuImport.vue")},
        {path:"otherHistoryRecord",component:()=>import("@/views/home/computerFun/otherHistoryRecord.vue")},
        {path:"weekHistoryRecord",component:()=>import("@/views/home/computerFun/weekHistoryRecord.vue")},
        {path:"earlyRecord",component:()=>import("@/views/home/computerFun/earlyRecord.vue")},
        {path:"lateRecord",component:()=>import("@/views/home/computerFun/lateRecord.vue")},
        {path:"classManage",component:()=>import("@/views/home/computerFun/classManage.vue")},
        {path:"specialtyManage",component:()=>import("@/views/home/computerFun/specialtyManage.vue")},
        {path:"collegeManage",component:()=>import("@/views/home/computerFun/collegeManage.vue")},
        {path:"teacherManage",component:()=>import("@/views/home/computerFun/teacherManage.vue")},
        {path:"studentManage",component:()=>import("@/views/home/computerFun/studentManage.vue")},
        {path:"dataStatistics",component:()=>import("@/views/home/computerFun/dataStatistics.vue")},
    ]
}