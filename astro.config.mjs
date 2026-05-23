import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';

// =============================================================================
//  CORSI
// -----------------------------------------------------------------------------
//  Per aggiungere un nuovo corso:
//    1. Crea la cartella: src/content/docs/<slug-corso>/
//    2. Aggiungi una riga qui sotto: { label: 'Nome Mostrato', dir: 'slug-corso' }
//    3. Scrivi gli .md dentro la cartella - la sidebar si autogenera.
// =============================================================================
const corsi = [
	{ label: 'Qualità del Software', dir: 'qualita-del-software' },
];

const sidebarCorsi = [
    {
        label: 'Qualità del Software',
        collapsed: true,
        items: [
            { label: 'Introduzione al corso', link: '/qualita-del-software/' },

            {
                label: '📖 Teoria',
                collapsed: true,
                autogenerate: { directory: 'qualita-del-software/teoria' }
            },

            {
                label: '📝 Assignments',
                collapsed: true,
                items: [
                    { 
                        label: 'Category Partition',
                        link: '/qualita-del-software/assignments/w3_a1/soluzione'
                    },
                    { 
                        label: 'Structural Testing',
                        link: '/qualita-del-software/assignments/w4_a2/soluzione'
                    },
                    { 
                        label: 'Data Control Dependence',
                        link: '/qualita-del-software/assignments/w5_a3/soluzione'
                    },
                ]
            },
        ]
    }
];

export default defineConfig({
	site: 'https://danieleriva.github.io',
	base: '/unimib-magistrale',

	integrations: [
		starlight({
			title: 'UNIMIB Magistrale',
			logo: {
				src: './public/favicon.ico',
			},
			favicon: './public/favicon.ico',
			customCss: [
				'./src/custom.css',
			],
			description: 'Appunti e materiale dei corsi della magistrale in Informatica - UNIMIB',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/DanieleRiva' }
			],

			plugins: [
				starlightThemeNova(),
			],

			head: [
				{
					tag: 'script',
					content: `
                        function initProgressBar() {
                            let bar = document.getElementById('scroll-progress');
                            if (!bar) {
                                bar = document.createElement('div');
                                bar.id = 'scroll-progress';
                                bar.style.position = 'fixed';
                                bar.style.top = '0';
                                bar.style.left = '0';
                                bar.style.height = '4px';
                                bar.style.backgroundColor = 'var(--sl-color-accent)';
                                bar.style.zIndex = '9999';
                                bar.style.width = '0%';
                                bar.style.transition = 'width 0.1s ease-out';
                                document.body.appendChild(bar);
                            }

                            window.addEventListener('scroll', () => {
                                const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
                                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                                if (height > 0) {
                                    const scrolled = (winScroll / height) * 100;
                                    bar.style.width = scrolled + '%';
                                } else {
                                    bar.style.width = '0%';
                                }
                            });
                        }

                        document.addEventListener('DOMContentLoaded', initProgressBar);
                    `
				}
			],

			// sidebar: corsi.map(({ label, dir }) => ({
			// 	label,
			// 	collapsed: true,
			// 	autogenerate: { directory: dir },
			// })),
			sidebar: sidebarCorsi,
		}),
	],
});
