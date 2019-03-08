Ballons concept 25feb19 - LesBallons
1.	Principe v1
a.	Des ballons de toutes couleurs se lèvent spontanément du paysage au cieux
b.	Il y a des nuages orageux dans le ciel proche
c.	Le joueur appuie sur les ballons
d.	Un relâchant, un ballon va au loin et évite les orages

2.	Principe v2
a.	On a du gazon, le ciel, et un nuage
b.	On choisit une couleur
c.	On appuie sur le gazon pour créer un ballon
d.	On clique sur le ballon pour le faire décoller
e.	Une fois au dessus du gazon, le ballon change état et on peut le cliquer pour le pousser au loin
f.	Si on laisse le ballon se lève, au niveau du nuage, de la foudre va le faire tomber
g.	Après avoir tombé, le ballon reste sur le gazon état 3
h.	On peut le cliquer pour recommencer

3.	Destinée pour
a.	Mobile - iPhone SE 1136 x 640

4.	Les dessins / les contrôles
a.	Les ballons sont les boutons


5.	Game mechanics
a.	Lorsque le joueur appuie 
b.	Niveaux
Depths
*  1. nuage - 100
*  2. ballons attérris / s'élèvent - 52-70
*  3. terre - 51
*  4. ballons s'eloignent 50-0

6.	Assets et profondeur ( zéro = le plus profond )
c.	Ballons, sprite
i.	0 - nouveau
ii.	1 - safe
iii.	2 - tombant
iv.	3 - tombé

7.	Changement d’état
a.	nouveau ballon
i.	frame 0
ii.	click pour décoller
iii.	isFlying = false
iv.	isSafe = false
v.	isFloating = false
vi.	isFalling = false
b.	ballon démarré
i.	y --
ii.	check for safe
iii.	isFlying = true
iv.	isSafe = false
v.	isFloating = false
vi.	isFalling = false
c.	ballon au dessus du gazon
i.	y --
ii.	frame 1
iii.	check for dans nuage
iv.	click pour s’en va
v.	isFlying = true
vi.	isSafe = true -- ajoute dans if()
vii.	isFloating = false
viii.	isFalling = false
d.	ballon s’en va
i.	y -- float
ii.	check for hors de vu
iii.	isFlying = true
iv.	isSafe = true
v.	isFloating = true
vi.	isFalling = false
e.	ballon dans nuage
i.	frame 2
ii.	isFlying = false
iii.	isSafe = false
iv.	isFloating = false
v.	isFalling = true - ajoute à click
f.	ballon tombé
i.	frame 3
ii.	click pour décoller
iii.	isFlying = false
iv.	isSafe = false
v.	isFloating = false
vi.	isFalling = false
g.	ballon relancé
i.	nouveau ballon ^^

8.	Autres idées de jeux
a.	Clean up the couscous / quinoa
b.	

