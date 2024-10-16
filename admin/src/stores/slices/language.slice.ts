import { LanguageType } from '@/types/language.type'
import { createSlice } from '@reduxjs/toolkit'

interface LanguageState {
  language: LanguageType
}

const initialState: LanguageState = {
  language: 'vi'
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: { payload: LanguageType }) {
      state.language = action.payload
    }
  }
})

export const { setLanguage } = languageSlice.actions

export default languageSlice.reducer
