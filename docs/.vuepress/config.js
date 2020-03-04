module.exports = {
    title: 'abnerLiu 的私人空间',
    description: '集博客与笔记，生活与一身',
    head: [
        ['link', { rel: 'icon', href: '/img/brush.png' }]
    ],
    base: '/',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: '学习笔记', link: '/study/' },
            { text: '每日一题', link: '/daily-question/' },
        ],
        sidebar: {
            '/study/':[
                {
                    title: 'Flutter', 
                    collapsable: true, 
                    children: [
                        '/study/flutter/variable', 
                    ]
                },
                {
                    title: '计算机网络', 
                    collapsable: true, 
                    children: [
                        '/study/network/protocol', 
                    ]
                },
            ]
        },
    },
}