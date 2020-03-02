module.exports = {
    title: 'abnerLiu 的私人空间',
    description: '集博客与笔记，生活与一身',
    base: '/',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: '学习笔记', link: '/guide/study/index.md' },
            { text: '每日一题', link: '/guide/daily-question/index.md' },
        ],
        themeConfig: {
            sidebar: [
                '/',
                '/guide/study/index.md',
                '/guide/daily-question/index.md'
            ]
        },
    },
    plugins: ['@vuepress/blog']
}