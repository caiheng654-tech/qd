/**
 * Style Genome · React 适配层（薄封装）
 * ------------------------------------------------------------
 * 内核 theme-engine.js 是框架无关的：它只往 DOM 节点写 CSS 变量。
 * React 这边只需一个 ThemeProvider + useTheme，把「换基因」接到状态上。
 * Headless 组件依旧用原生 SGComponents（返回 DOM），可包进 React 组件里。
 */
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ThemeContext = createContext({ themeId: null, setTheme: () => {} });

/**
 * 在 React 组件树根部套用：<SGThemeProvider rootRef={...}>
 * 它负责在 themeId 变化时调用 SG.applyTheme 重刷 CSS 变量。
 */
export function SGThemeProvider({ children, initialTheme = 'minimal-white', targetRef }) {
  const [themeId, setThemeId] = useState(initialTheme);
  const el = targetRef && targetRef.current ? targetRef.current : document.documentElement;

  useEffect(() => {
    if (window.SG) window.SG.applyTheme(themeId, el);
  }, [themeId, el]);

  return (
    <ThemeContext.Provider value={{ themeId, setTheme: setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** 把原生 Headless 组件包装成 React 组件（示例：Navbar） */
export function Navbar({ links, brand }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.SGComponents) {
      ref.current.appendChild(window.SGComponents.navbar({ links, brand }));
      return () => { ref.current.innerHTML = ''; };
    }
  }, [links, brand]);
  return <div ref={ref} />;
}
