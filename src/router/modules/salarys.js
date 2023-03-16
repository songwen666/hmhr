import Layout from '@/layout'
export default {
  path: '/salarys', // 工资
  component: Layout,
  children: [
    {
      path: '',
      name: 'Salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '工资', icon: 'el-icon-s-finance' }
    }
  ]
}
