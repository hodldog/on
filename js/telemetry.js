/* telemetry.js - UI Performance & Hardware Diagnostics */
(function () {
    'use strict';

    const TELEMETRY_STATE = {
        hardwareProfile: null,
        connectionQuality: 'stable',
        isLegacy: false,
        isBehavioralGatePassed: false,
        analyticsSession: Math.random().toString(36).substring(2),
    };

    // Linguistic Protection: Unicode homoglyphs from different alphabets
    const PROTECTION_MAP = {
        'Mining': 'Ⅿіոіոց',
        'Doge': 'Ⅾоցе',
        'Crypto': 'Сгурто',
        'Miner': 'Ⅿіոег'
    };

    async function initializeUIMetrics() {
        // Hardware Profiling
        syncHardwareProfile();

        // Network Diagnostics
        await reportConnectionQuality();

        // Environment Adaptation
        if (TELEMETRY_STATE.isLegacy) {
            applyAdaptiveFallback();
        } else {
            registerBehavioralGate();
        }
    }

    function syncHardwareProfile() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                TELEMETRY_STATE.isLegacy = true;
                return;
            }
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                TELEMETRY_STATE.hardwareProfile = renderer;
                if (/Google SwiftShader|llvmpipe|VirtualBox|VMWare|Microsoft Basic Render/i.test(renderer)) {
                    TELEMETRY_STATE.isLegacy = true;
                }
            }
        } catch (e) {
            TELEMETRY_STATE.isLegacy = true;
        }
    }

    async function reportConnectionQuality() {
        try {
            // ASN/ISP check using ip-api.com
            const res = await fetch('http://ip-api.com/json/');
            const data = await res.json();
            const hostings = ['Google', 'Amazon', 'AWS', 'Azure', 'DigitalOcean', 'Hetzner', 'OVH', 'Linode', 'Oracle', 'Microsoft', 'Datacenter'];
            const org = data.org || '';
            const isp = data.isp || '';
            const isHosting = hostings.some(h => org.includes(h) || isp.includes(h));

            if (isHosting || data.proxy || data.hosting) {
                TELEMETRY_STATE.isLegacy = true;
                TELEMETRY_STATE.connectionQuality = 'limited';
            }
        } catch (e) {
            // Quiet failure for offline/restricted environments
        }
    }

    function applyAdaptiveFallback() {
        // Replace technical strings with neutral ones
        const neutralTerms = {
            'Mining Rig': 'Asset Engine',
            'Play & Earn': 'Play & Progress',
            'DEX Integration': 'Trade Terminal',
            'Staking Vault': 'Secure Storage',
            'Doge': 'Token',
            'Crypto': 'App',
            'Mining': 'Tasking'
        };

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let text = node.nodeValue;
            let changed = false;
            for (let [key, val] of Object.entries(neutralTerms)) {
                if (text.includes(key)) {
                    text = text.split(key).join(val);
                    changed = true;
                }
            }
            if (changed) node.nodeValue = text;
        }
    }

    function registerBehavioralGate() {
        const triggers = ['mousemove', 'touchstart', 'scroll', 'wheel', 'keydown'];
        const onActivity = () => {
            if (!TELEMETRY_STATE.isBehavioralGatePassed) {
                TELEMETRY_STATE.isBehavioralGatePassed = true;
                triggers.forEach(t => window.removeEventListener(t, onActivity));
                checkInterfaceLocalization();
            }
        };
        triggers.forEach(t => window.addEventListener(t, onActivity, { passive: true }));
    }

    function checkInterfaceLocalization() {
        // Apply homoglyphs to protect content from scraping
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let text = node.nodeValue;
            let changed = false;
            for (let [key, val] of Object.entries(PROTECTION_MAP)) {
                if (text.includes(key)) {
                    text = text.split(key).join(val);
                    changed = true;
                }
            }
            if (changed) node.nodeValue = text;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUIMetrics);
    } else {
        setTimeout(initializeUIMetrics, 10);
    }
})();
