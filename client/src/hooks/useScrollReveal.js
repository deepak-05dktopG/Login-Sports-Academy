import { useEffect } from 'react'

/**
 * Adds `is-revealed` when elements enter the viewport.
 * Usage: add `data-reveal` + `reveal` class to any element.
 */
export function useScrollReveal({
  selector = '[data-reveal]',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.08,
  once = true,
  stagger = 70,
  maxStagger = 420,
} = {}) {
  useEffect(() => {
    const observed = new WeakSet()

    const applyStagger = (elements, startIndex = 0) => {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        // Allow explicit per-element delay overrides
        const explicit = el.getAttribute('data-reveal-delay') ?? el.getAttribute('data-delay')
        if (explicit != null && explicit !== '') {
          const ms = Number(explicit)
          if (Number.isFinite(ms)) el.style.transitionDelay = `${Math.max(0, ms)}ms`
          continue
        }
        // Only set if not already set by inline style/CSS
        if (el.style.transitionDelay) continue
        const delay = Math.min(maxStagger, Math.max(0, (startIndex + i) * stagger))
        if (delay) el.style.transitionDelay = `${delay}ms`
      }
    }

    const observeAll = (root = document) => {
      const elements = Array.from(root.querySelectorAll(selector))
      if (!elements.length) return

      applyStagger(elements)
      for (const el of elements) {
        if (observed.has(el)) continue
        observer.observe(el)
        observed.add(el)
      }
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-revealed')
          }
        }
      },
      { root: null, rootMargin, threshold }
    )

    // Initial scan
    observeAll(document)

    // Watch for async-rendered content (e.g., posts loaded after fetch)
    const mo = new MutationObserver(mutations => {
      let newCount = 0
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue
          // If the node itself matches selector, include it; also scan subtree.
          const candidates = []
          if (node.matches?.(selector)) candidates.push(node)
          const descendants = node.querySelectorAll?.(selector)
          if (descendants?.length) candidates.push(...descendants)
          if (candidates.length) {
            applyStagger(candidates, newCount)
            for (const el of candidates) {
              if (observed.has(el)) continue
              observer.observe(el)
              observed.add(el)
              newCount++
            }
          }
        }
      }
    })

    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      observer.disconnect()
    }
  }, [selector, rootMargin, threshold, once, stagger, maxStagger])
}
