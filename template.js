const bitvector = (prefix, size) => [...Array(size).keys()].reverse().map(x => prefix + x).join(', ')

const ANDXORANDXORAND = (params, size) => 'def ANDXORANDXORAND(' + params.map(p => bitvector(p, size)).join(', ') + '):\n\treturn ' + [...Array(size).keys()].reverse().map(x => 'XOR(XOR(AND(' + params[0] + x + ',' + params[1] + x + '),AND(' + params[0] + x + ',' + params[2] + x + ')),AND(' + params[1] + x + ',' + params[2] + x + '))').join(', ')
const ANDXORNOTAND = (params, size) => 'def ANDXORNOTAND(' + params.map(p => bitvector(p, size)).join(', ') + '):\n\treturn ' + [...Array(size).keys()].reverse().map(x => 'XOR(AND(' + params[0] + x + ',' + params[1] + x + '),AND(NOT(' + params[0] + x + '), ' + params[2] + x + '))').join(', ')
const ADD5 = (a, b, c, d, e, size) => 'def ADD(' + [a, b, c, d, e].map(p => bitvector(p, size)).join(', ') + '):\n\t' + 
	bitvector(a+b, size) + ' = ADD(' + bitvector(a, size) + ', ' + bitvector(b, size) + ')\n\t' +
	bitvector(c+d, size) + ' = ADD(' + bitvector(c, size) + ', ' + bitvector(d, size) + ')\n\t' +
	bitvector(a+b+c+d, size) + ' = ADD(' + bitvector(a+b, size) + ', ' + bitvector(c+d, size) + ')\n\t' +
	bitvector(a+b+c+d+e, size) + ' = ADD(' + bitvector(a+b+c+d, size) + ', ' + bitvector(e, size) + ')\n\t' +
	'return ' + bitvector(a+b+c+d+e, size)
const ARXORARXORAR = (param, offset1, offset2, offset3, size) => 'def AR' + offset1 + 'XORAR' + offset2 + 'XORAR' + offset3 + '(' + bitvector(param, size) + '):\n\t' +
	bitvector('u', size) + ' = RIGHTROTATE' + offset1 + '(' + bitvector(param, size) + ')\n\t' +
	bitvector('v', size) + ' = RIGHTROTATE' + offset2 + '(' + bitvector(param, size) + ')\n\t' +
	bitvector('w', size) + ' = RIGHTROTATE' + offset3 + '(' + bitvector(param, size) + ')\n\t' +
	bitvector('x', size) + ' = XOR(' + bitvector('u', size) + ', ' + bitvector('v', size) + ')\n\t' +
	bitvector('z', size) + ' = XOR(' + bitvector('w', size) + ', ' + bitvector('x', size) + ')\n\t' +
	'return ' + bitvector('z', size)


const extenditeration = (n, size) =>
	"\t// EXTEND PASS " + n + "\n\t" +
	"// s0 := (w[i-15] rightrotate 7) xor (w[i-15] rightrotate 18) xor (w[i-15] rightshift 3)\n\t" +
	bitvector('szero', size) + " = AR7XORAR18XORAR3(" + bitvector('w' + (n - 15) + 'b', size) + ")\n\t" +
	"// s1 := (w[i-2] rightrotate 17) xor (w[i-2] rightrotate 19) xor (w[i-2] rightshift 10)\n\t" +
	bitvector('sone', size) + " = AR7XORAR18XORAR3(" + bitvector('w' + (n - 2) + 'b', size) + ")\n\t" +
	"// w[i] := w[i-16] + s0 + w[i-7] + s1\n\t" +
	bitvector('w' + n + 'b', size) + " = ADD(" + bitvector('w' + (n - 16) + 'b', size) + ", " + bitvector('szero', size) + ', ' + bitvector('w' + (n - 7) + 'b', size) + ', ' + bitvector('sone', size) + ")\n\t"

const compressiteration = (n, size) =>
	"\t// COMPRESS PASS " + n + "\n\t" +
	"// S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)\n\t" +
	"SOne31, SOne30, SOne29, SOne28, SOne27, SOne26, SOne25, SOne24, SOne23, SOne22, SOne21, SOne20, SOne19, SOne18, SOne17, SOne16, SOne15, SOne14, SOne13, SOne12, SOne11, SOne10, SOne9, SOne8, SOne7, SOne6, SOne5, SOne4, SOne3, SOne2, SOne1, SOne0 = AR6XORAR11XORAR25(e31, e30, e29, e28, e27, e26, e25, e24, e23, e22, e21, e20, e19, e18, e17, e16, e15, e14, e13, e12, e11, e10, e9, e8, e7, e6, e5, e4, e3, e2, e1, e0)\n\t" +
	"// ch := (e and f) xor ((not e) and g)\n\t" +
	"ch31, ch30, ch29, ch28, ch27, ch26, ch25, ch24, ch23, ch22, ch21, ch20, ch19, ch18, ch17, ch16, ch15, ch14, ch13, ch12, ch11, ch10, ch9, ch8, ch7, ch6, ch5, ch4, ch3, ch2, ch1, ch0 = ANDXORNOTAND(e31, e30, e29, e28, e27, e26, e25, e24, e23, e22, e21, e20, e19, e18, e17, e16, e15, e14, e13, e12, e11, e10, e9, e8, e7, e6, e5, e4, e3, e2, e1, e0, f31, f30, f29, f28, f27, f26, f25, f24, f23, f22, f21, f20, f19, f18, f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0, g31, g30, g29, g28, g27, g26, g25, g24, g23, g22, g21, g20, g19, g18, g17, g16, g15, g14, g13, g12, g11, g10, g9, g8, g7, g6, g5, g4, g3, g2, g1, g0)\n\t" +
	"// temp1 := h + S1 + ch + k[i] + w[i]\n\t" +
	"k31, k30, k29, k28, k27, k26, k25, k24, k23, k22, k21, k20, k19, k18, k17, k16, k15, k14, k13, k12, k11, k10, k9, k8, k7, k6, k5, k4, k3, k2, k1, k0 = K" + n + "()\n\t" +
	"w31, w30, w29, w28, w27, w26, w25, w24, w23, w22, w21, w20, w19, w18, w17, w16, w15, w14, w13, w12, w11, w10, w9, w8, w7, w6, w5, w4, w3, w2, w1, w0 = COPY(" + bitvector('w' + n + 'b', size) + ")\n\t" + 
	"tempOne31, tempOne30, tempOne29, tempOne28, tempOne27, tempOne26, tempOne25, tempOne24, tempOne23, tempOne22, tempOne21, tempOne20, tempOne19, tempOne18, tempOne17, tempOne16, tempOne15, tempOne14, tempOne13, tempOne12, tempOne11, tempOne10, tempOne9, tempOne8, tempOne7, tempOne6, tempOne5, tempOne4, tempOne3, tempOne2, tempOne1, tempOne0 = ADD(k31, k30, k29, k28, k27, k26, k25, k24, k23, k22, k21, k20, k19, k18, k17, k16, k15, k14, k13, k12, k11, k10, k9, k8, k7, k6, k5, k4, k3, k2, k1, k0, w31, w30, w29, w28, w27, w26, w25, w24, w23, w22, w21, w20, w19, w18, w17, w16, w15, w14, w13, w12, w11, w10, w9, w8, w7, w6, w5, w4, w3, w2, w1, w0, ch31, ch30, ch29, ch28, ch27, ch26, ch25, ch24, ch23, ch22, ch21, ch20, ch19, ch18, ch17, ch16, ch15, ch14, ch13, ch12, ch11, ch10, ch9, ch8, ch7, ch6, ch5, ch4, ch3, ch2, ch1, ch0, SOne31, SOne30, SOne29, SOne28, SOne27, SOne26, SOne25, SOne24, SOne23, SOne22, SOne21, SOne20, SOne19, SOne18, SOne17, SOne16, SOne15, SOne14, SOne13, SOne12, SOne11, SOne10, SOne9, SOne8, SOne7, SOne6, SOne5, SOne4, SOne3, SOne2, SOne1, SOne0, h31, h30, h29, h28, h27, h26, h25, h24, h23, h22, h21, h20, h19, h18, h17, h16, h15, h14, h13, h12, h11, h10, h9, h8, h7, h6, h5, h4, h3, h2, h1, h0)\n\t" +
	"// S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)\n\t" +
	"SZero31, SZero30, SZero29, SZero28, SZero27, SZero26, SZero25, SZero24, SZero23, SZero22, SZero21, SZero20, SZero19, SZero18, SZero17, SZero16, SZero15, SZero14, SZero13, SZero12, SZero11, SZero10, SZero9, SZero8, SZero7, SZero6, SZero5, SZero4, SZero3, SZero2, SZero1, SZero0 = AR2XORAR13XORAR22(a31, a30, a29, a28, a27, a26, a25, a24, a23, a22, a21, a20, a19, a18, a17, a16, a15, a14, a13, a12, a11, a10, a9, a8, a7, a6, a5, a4, a3, a2, a1, a0)\n\t" + 
	"// maj := (a and b) xor (a and c) xor (b and c)\n\t" +
	"maj31, maj30, maj29, maj28, maj27, maj26, maj25, maj24, maj23, maj22, maj21, maj20, maj19, maj18, maj17, maj16, maj15, maj14, maj13, maj12, maj11, maj10, maj9, maj8, maj7, maj6, maj5, maj4, maj3, maj2, maj1, maj0 = ANDXORANDXORAND(a31, a30, a29, a28, a27, a26, a25, a24, a23, a22, a21, a20, a19, a18, a17, a16, a15, a14, a13, a12, a11, a10, a9, a8, a7, a6, a5, a4, a3, a2, a1, a0, b31, b30, b29, b28, b27, b26, b25, b24, b23, b22, b21, b20, b19, b18, b17, b16, b15, b14, b13, b12, b11, b10, b9, b8, b7, b6, b5, b4, b3, b2, b1, b0, c31, c30, c29, c28, c27, c26, c25, c24, c23, c22, c21, c20, c19, c18, c17, c16, c15, c14, c13, c12, c11, c10, c9, c8, c7, c6, c5, c4, c3, c2, c1, c0)\n\t" +
	"// temp2 := S0 + maj\n\t" +
	"tempTwo31, tempTwo30, tempTwo29, tempTwo28, tempTwo27, tempTwo26, tempTwo25, tempTwo24, tempTwo23, tempTwo22, tempTwo21, tempTwo20, tempTwo19, tempTwo18, tempTwo17, tempTwo16, tempTwo15, tempTwo14, tempTwo13, tempTwo12, tempTwo11, tempTwo10, tempTwo9, tempTwo8, tempTwo7, tempTwo6, tempTwo5, tempTwo4, tempTwo3, tempTwo2, tempTwo1, tempTwo0 = ADD(SZero31, SZero30, SZero29, SZero28, SZero27, SZero26, SZero25, SZero24, SZero23, SZero22, SZero21, SZero20, SZero19, SZero18, SZero17, SZero16, SZero15, SZero14, SZero13, SZero12, SZero11, SZero10, SZero9, SZero8, SZero7, SZero6, SZero5, SZero4, SZero3, SZero2, SZero1, SZero0, maj31, maj30, maj29, maj28, maj27, maj26, maj25, maj24, maj23, maj22, maj21, maj20, maj19, maj18, maj17, maj16, maj15, maj14, maj13, maj12, maj11, maj10, maj9, maj8, maj7, maj6, maj5, maj4, maj3, maj2, maj1, maj0)\n\t"
	"// h := g\n\t" +
	"h31, h30, h29, h28, h27, h26, h25, h24, h23, h22, h21, h20, h19, h18, h17, h16, h15, h14, h13, h12, h11, h10, h9, h8, h7, h6, h5, h4, h3, h2, h1, h0 = COPY(g31, g30, g29, g28, g27, g26, g25, g24, g23, g22, g21, g20, g19, g18, g17, g16, g15, g14, g13, g12, g11, g10, g9, g8, g7, g6, g5, g4, g3, g2, g1, g0)\n\t" +
	"// g := f"
	"g31, g30, g29, g28, g27, g26, g25, g24, g23, g22, g21, g20, g19, g18, g17, g16, g15, g14, g13, g12, g11, g10, g9, g8, g7, g6, g5, g4, g3, g2, g1, g0 = COPY(f31, f30, f29, f28, f27, f26, f25, f24, f23, f22, f21, f20, f19, f18, f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0)\n\t" +
	"// f := e"
	"f31, f30, f29, f28, f27, f26, f25, f24, f23, f22, f21, f20, f19, f18, f17, f16, f15, f14, f13, f12, f11, f10, f9, f8, f7, f6, f5, f4, f3, f2, f1, f0 = COPY(e31, e30, e29, e28, e27, e26, e25, e24, e23, e22, e21, e20, e19, e18, e17, e16, e15, e14, e13, e12, e11, e10, e9, e8, e7, e6, e5, e4, e3, e2, e1, e0)\n\t" +
	"// e := d + temp1\n\t" + 
	"e31, e30, e29, e28, e27, e26, e25, e24, e23, e22, e21, e20, e19, e18, e17, e16, e15, e14, e13, e12, e11, e10, e9, e8, e7, e6, e5, e4, e3, e2, e1, e0 = ADD(d31, d30, d29, d28, d27, d26, d25, d24, d23, d22, d21, d20, d19, d18, d17, d16, d15, d14, d13, d12, d11, d10, d9, d8, d7, d6, d5, d4, d3, d2, d1, d0, tempOne31, tempOne30, tempOne29, tempOne28, tempOne27, tempOne26, tempOne25, tempOne24, tempOne23, tempOne22, tempOne21, tempOne20, tempOne19, tempOne18, tempOne17, tempOne16, tempOne15, tempOne14, tempOne13, tempOne12, tempOne11, tempOne10, tempOne9, tempOne8, tempOne7, tempOne6, tempOne5, tempOne4, tempOne3, tempOne2, tempOne1, tempOne0)\n\t" +
	"// d := c"
	"d31, d30, d29, d28, d27, d26, d25, d24, d23, d22, d21, d20, d19, d18, d17, d16, d15, d14, d13, d12, d11, d10, d9, d8, d7, d6, d5, d4, d3, d2, d1, d0 = COPY(c31, c30, c29, c28, c27, c26, c25, c24, c23, c22, c21, c20, c19, c18, c17, c16, c15, c14, c13, c12, c11, c10, c9, c8, c7, c6, c5, c4, c3, c2, c1, c0)\n\t" +
	"// c := b"
	"c31, c30, c29, c28, c27, c26, c25, c24, c23, c22, c21, c20, c19, c18, c17, c16, c15, c14, c13, c12, c11, c10, c9, c8, c7, c6, c5, c4, c3, c2, c1, c0 = COPY(b31, b30, b29, b28, b27, b26, b25, b24, b23, b22, b21, b20, b19, b18, b17, b16, b15, b14, b13, b12, b11, b10, b9, b8, b7, b6, b5, b4, b3, b2, b1, b0)\n\t" +
	"// b := a"
	"b31, b30, b29, b28, b27, b26, b25, b24, b23, b22, b21, b20, b19, b18, b17, b16, b15, b14, b13, b12, b11, b10, b9, b8, b7, b6, b5, b4, b3, b2, b1, b0 = COPY(a31, a30, a29, a28, a27, a26, a25, a24, a23, a22, a21, a20, a19, a18, a17, a16, a15, a14, a13, a12, a11, a10, a9, a8, a7, a6, a5, a4, a3, a2, a1, a0)\n\t" +
	"// a := temp1 + temp2\n\t" + 
	"a31, a30, a29, a28, a27, a26, a25, a24, a23, a22, a21, a20, a19, a18, a17, a16, a15, a14, a13, a12, a11, a10, a9, a8, a7, a6, a5, a4, a3, a2, a1, a0 = ADD(tempOne31, tempOne30, tempOne29, tempOne28, tempOne27, tempOne26, tempOne25, tempOne24, tempOne23, tempOne22, tempOne21, tempOne20, tempOne19, tempOne18, tempOne17, tempOne16, tempOne15, tempOne14, tempOne13, tempOne12, tempOne11, tempOne10, tempOne9, tempOne8, tempOne7, tempOne6, tempOne5, tempOne4, tempOne3, tempOne2, tempOne1, tempOne0, tempTwo31, tempTwo30, tempTwo29, tempTwo28, tempTwo27, tempTwo26, tempTwo25, tempTwo24, tempTwo23, tempTwo22, tempTwo21, tempTwo20, tempTwo19, tempTwo18, tempTwo17, tempTwo16, tempTwo15, tempTwo14, tempTwo13, tempTwo12, tempTwo11, tempTwo10, tempTwo9, tempTwo8, tempTwo7, tempTwo6, tempTwo5, tempTwo4, tempTwo3, tempTwo2, tempTwo1, tempTwo0)\n\t"

	// END LOOP
// console.log(ANDXORANDXORAND(['a', 'b', 'c'], 32))
// console.log('\n\n\n\n')
// console.log(ANDXORNOTAND(['a', 'b', 'c'], 32))

//console.log(ADD5('a','b','c','d', 'e', 32))
//console.log(ARXORARXORAR('a', 17, 19, 10, 32))

//const main = () => [...Array(48).keys()].forEach(x => {console.log(extenditeration(x + 16, 32))})
//main()

const main = () => [...Array(64).keys()].forEach(x => {console.log(compressiteration(x, 32))})

main()