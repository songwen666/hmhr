import Layout from '@/layout'
export default {
  path: '/permission', // 权限管理
  component: Layout,
  children: [
    {
      path: '',
      name: 'Permissions',
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'el-icon-unlock' }
    }
  ]
}
