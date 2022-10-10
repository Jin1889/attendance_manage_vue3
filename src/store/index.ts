import { createStore } from 'vuex'

export default createStore({
  state: {
    employeeId: 0,
    attendanceStateId: 0
  },
  getters: {
  },
  mutations: {
    SET_ATTENDANCE_STATE(state, value){
      state.attendanceStateId = value
    },
    SET_EMPLOYEE_ID(state, value){
      state.employeeId = value
    }
  },
  actions: {
  },
  modules: {
  }
})
