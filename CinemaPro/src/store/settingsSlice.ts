import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import i18n from "../i18n";

interface SettingsState {
    language: 'es' | 'en';
    theme: 'light' | 'dark';
}

const initialState: SettingsState = {
    language: 'es', 
    theme: 'dark'
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        setLanguage: (state, action: PayloadAction<'es' | 'en'>) => {
            state.language = action.payload;
            i18n.locale = action.payload;
        },
        toggleLanguage: (state) => {
            const newLang = state.language === 'es' ? 'en' : 'es';
            state.language = newLang;
            i18n.locale = newLang;
        }
    },
});

export const { toggleTheme, setLanguage, toggleLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;