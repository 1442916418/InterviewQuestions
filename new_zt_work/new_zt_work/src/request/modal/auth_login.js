/**
 *  auth_login 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const auth_login = {
    // 用户登陆
    login(params) {
        return instance.post(`${base.login}/auth_login/login`, params);
    },
    // 发送手机验证码
    getMobileCode(params) {
        return instance.post(`${base.login}/auth_login/mobile/code/get`, params);
    },
    // 找回密码
    findMobilePassword(params) {
        return instance.post(`${base.login}/auth_login/mobile/password/find`, params);
    },
    // 菜单加载
    getMenuLoadList() {
        return instance.post(`${base.login}/auth_login/login/menu/load`);
    },
    // 用户列表
    getUserDataList(params) {
        return instance.post(`${base.login}/auth_login/login/user/data`, params);
    },
    // 删除用户
    deleteUser(params) {
        return instance.post(`${base.login}/auth_login/login/user/delete`, params);
    },
    // 编辑用户
    editUser(params) {
        return instance.post(`${base.login}/auth_login/login/user/edit`, params);
    },
    // 添加用户
    addUser(params) {
        return instance.post(`${base.login}/auth_login/login/user/add`, params);
    },
    // 菜单列表
    getMenuList(params) {
        return instance.post(`${base.login}/auth_login/login/menu/data`, params);
    },
    // 删除菜单
    deleteMenu(params) {
        return instance.post(`${base.login}/auth_login/login/menu/delete`, params);
    },
    // 编辑菜单
    editMenu(params) {
        return instance.post(`${base.login}/auth_login/login/menu/edit`, params);
    },
    // 添加菜单
    addMenu(params) {
        return instance.post(`${base.login}/auth_login/login/menu/add`, params);
    },
    // 角色列表
    getRoleList(params) {
        return instance.post(`${base.login}/auth_login/login/role/data`, params);
    },
    // 删除角色
    deleteRole(params) {
        return instance.post(`${base.login}/auth_login/login/role/delete`, params);
    },
    // 编辑角色
    editRole(params) {
        return instance.post(`${base.login}/auth_login/login/role/edit`, params);
    },
    // 添加角色
    addRole(params) {
        return instance.post(`${base.login}/auth_login/login/role/add`, params);
    },
    // 权限组列表 
    getPowerGroupList(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/data`, params);
    },
    // 删除权限组
    deletePowerGroup(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/delete`, params);
    },
    // 编辑权限组
    editPowerGroup(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/edit`, params);
    },
    // 添加权限组
    addPowerGroup(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/add`, params);
    },
    // 权限列表
    getPowerList(params) {
        return instance.post(`${base.login}/auth_login/login/power/data`, params);
    },
    // 删除权限
    deletePower(params) {
        return instance.post(`${base.login}/auth_login/login/power/delete`, params);
    },
    // 添加权限
    addPower(params) {
        return instance.post(`${base.login}/auth_login/login/power/add`, params);
    },
    // 角色权限组
    getPowerGroupRolesList(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/role/data`, params);
    },
    // 删除角色权限组关系
    deletePowerGroupRoles(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/role/delete`, params);
    },
    // 添加角色权限组关系
    addPowerGroupRoles(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/role/add`, params);
    },
    // 权限组权限
    getPowerGroupPowerList(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/power/data`, params);
    },
    // 删除权限组权限关系
    deletePowerGroupPower(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/power/delete`, params);
    },
    // 批量删除权限组权限关系
    deletePowerGroupPowers(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/powers/delete`, params);
    },
    // 添加权限组权限关系
    addPowerGroupPower(params) {
        return instance.post(`${base.login}/auth_login/login/power_group/power/add`, params);
    },
    // 菜单权限关系列表
    getMenuPower(params) {
        return instance.post(`${base.login}/auth_login/login/menu/power/data`, params);
    },
    // 删除菜单权限关系
    deleteMenuPower(params) {
        return instance.post(`${base.login}/auth_login/login/menu/power/delete`, params);
    },
    // 批量删除菜单权限关系
    deleteMenuPowers(params) {
        return instance.post(`${base.login}/auth_login/login/menu/powers/delete`, params);
    },
    // 添加菜单权限关系
    addMenuPower(params) {
        return instance.post(`${base.login}/auth_login/login/menu/power/add`, params);
    },
    // 批量添加菜单权限关系
    addMenuPowers(params) {
        return instance.post(`${base.login}/auth_login/login/menu/powers/add`, params);
    },
    // 角色权限关系列表
    getRolePower(params) {
        return instance.post(`${base.login}/auth_login/login/role/power/data`, params);
    },
    // 批量添加角色权限关系
    addRolePowers(params) {
        return instance.post(`${base.login}/auth_login/login/role/power/add`, params);
    },
    // 根据条件筛选用户列表
    getUserOther(params) {
        return instance.post(`${base.login}/auth_login/login/user/data/other`, params);
    },
    // 操作日志列表（超管权限调用）
    getOperationalLog(params) {
        return instance.post(`${base.login}/auth_login/login/log/data`, params);
    },
    // 手机号注册
    register(params) {
        return instance.post(`${base.login}/auth_login/mobile/reg`, params);
    },
    // 修改密码
    modifyPassword(params) {
        return instance.post(`${base.login}/auth_login/login/user/password/change`, params);
    },
    // 添加部门名称
    addDepartment(params) {
        return instance.post(`${base.login}/auth_login/login/department/add`, params);
    },
    // 编辑部门名称
    editDepartment(params) {
        return instance.post(`${base.login}/auth_login/login/department/edit`, params);
    },
    // 删除部门名称
    deleteDepartment(params) {
        return instance.post(`${base.login}/auth_login/login/department/delete`, params);
    },
    // 部门名称列表
    getDepartmentData(params) {
        return instance.post(`${base.login}/auth_login/login/department/data`, params);
    },
    // 添加会议室名称
    addMeetingRoom(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/add`, params);
    },
    // 编辑会议室名称
    editMeetingRoom(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/edit`, params);
    },
    // 删除会议室名称
    deleteMeetingRoom(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/delete`, params);
    },
    // 会议室名称列表
    getMeetingRoom(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/data`, params);
    },
    // 批量添加会议室和部门关系
    addMeetingRoomAndDepartmentRelationship(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/department/add`, params);
    },
    // 会议室和部门关系列表
    getMeetingRoomAndDepartmentRelationship(params) {
        return instance.post(`${base.login}/auth_login/login/meeting_room/department/data`, params);
    },
    // 预约会议
    appointmentMeeting(params) {
        return instance.post(`${base.login}/auth_login/login/meeting/add`, params);
    },
    // 取消预约会议
    cancelAppointment(params) {
        return instance.post(`${base.login}/auth_login/login/meeting/delete`, params);
    },
    // 预约会议记录
    getAppointmentData(params) {
        return instance.post(`${base.login}/auth_login/login/meeting/data`, params);
    },
    // 获取单个用户信息
    getOneUserData(params) {
        return instance.post(`${base.login}/auth_login/login/user/single/data`, params);
    },
}

export default auth_login;
