var CryptoJS = CryptoJS || function(s, q) {
    var t = {}
      , w = t.lib = {}
      , c = w.Base = function() {
        function b() {}
        return {
            extend: function(d) {
                b.prototype = this;
                var f = new b;
                d && f.mixIn(d);
                f.$super = this;
                return f
            },
            create: function() {
                var d = this.extend();
                d.init.apply(d, arguments);
                return d
            },
            init: function() {},
            mixIn: function(d) {
                for (var f in d) {
                    d.hasOwnProperty(f) && (this[f] = d[f])
                }
                d.hasOwnProperty("toString") && (this.toString = d.toString)
            },
            clone: function() {
                return this.$super.extend(this)
            }
        }
    }()
      , e = w.WordArray = c.extend({
        init: function(b, d) {
            b = this.words = b || [];
            this.sigBytes = d != q ? d : 4 * b.length
        },
        toString: function(b) {
            return (b || v).stringify(this)
        },
        concat: function(f) {
            var g = this.words
              , i = f.words
              , h = this.sigBytes
              , f = f.sigBytes;
            this.clamp();
            if (h % 4) {
                for (var d = 0; d < f; d++) {
                    g[h + d >>> 2] |= (i[d >>> 2] >>> 24 - 8 * (d % 4) & 255) << 24 - 8 * ((h + d) % 4)
                }
            } else {
                if (65535 < i.length) {
                    for (d = 0; d < f; d += 4) {
                        g[h + d >>> 2] = i[d >>> 2]
                    }
                } else {
                    g.push.apply(g, i)
                }
            }
            this.sigBytes += f;
            return this
        },
        clamp: function() {
            var b = this.words
              , d = this.sigBytes;
            b[d >>> 2] &= 4294967295 << 32 - 8 * (d % 4);
            b.length = s.ceil(d / 4)
        },
        clone: function() {
            var b = c.clone.call(this);
            b.words = this.words.slice(0);
            return b
        },
        random: function(b) {
            for (var d = [], f = 0; f < b; f += 4) {
                d.push(4294967296 * s.random() | 0)
            }
            return e.create(d, b)
        }
    })
      , a = t.enc = {}
      , v = a.Hex = {
        stringify: function(g) {
            for (var h = g.words, g = g.sigBytes, j = [], f = 0; f < g; f++) {
                var i = h[f >>> 2] >>> 24 - 8 * (f % 4) & 255;
                j.push((i >>> 4).toString(16));
                j.push((i & 15).toString(16))
            }
            return j.join("")
        },
        parse: function(f) {
            for (var g = f.length, h = [], d = 0; d < g; d += 2) {
                h[d >>> 3] |= parseInt(f.substr(d, 2), 16) << 24 - 4 * (d % 8)
            }
            return e.create(h, g / 2)
        }
    }
      , p = a.Latin1 = {
        stringify: function(g) {
            for (var h = g.words, g = g.sigBytes, f = [], i = 0; i < g; i++) {
                f.push(String.fromCharCode(h[i >>> 2] >>> 24 - 8 * (i % 4) & 255))
            }
            return f.join("")
        },
        parse: function(g) {
            for (var f = g.length, i = [], h = 0; h < f; h++) {
                i[h >>> 2] |= (g.charCodeAt(h) & 255) << 24 - 8 * (h % 4)
            }
            return e.create(i, f)
        }
    }
      , o = a.Utf8 = {
        stringify: function(f) {
            try {
                return decodeURIComponent(escape(p.stringify(f)))
            } catch (d) {
                throw Error("Malformed UTF-8 data")
            }
        },
        parse: function(b) {
            return p.parse(unescape(encodeURIComponent(b)))
        }
    }
      , r = w.BufferedBlockAlgorithm = c.extend({
        reset: function() {
            this._data = e.create();
            this._nDataBytes = 0
        },
        _append: function(b) {
            "string" == typeof b && (b = o.parse(b));
            this._data.concat(b);
            this._nDataBytes += b.sigBytes
        },
        _process: function(i) {
            var g = this._data
              , u = g.words
              , n = g.sigBytes
              , k = this.blockSize
              , l = n / (4 * k)
              , l = i ? s.ceil(l) : s.max((l | 0) - this._minBufferSize, 0)
              , i = l * k
              , n = s.min(4 * i, n);
            if (i) {
                for (var m = 0; m < i; m += k) {
                    this._doProcessBlock(u, m)
                }
                m = u.splice(0, i);
                g.sigBytes -= n
            }
            return e.create(m, n)
        },
        clone: function() {
            var b = c.clone.call(this);
            b._data = this._data.clone();
            return b
        },
        _minBufferSize: 0
    });
    w.Hasher = r.extend({
        init: function() {
            this.reset()
        },
        reset: function() {
            r.reset.call(this);
            this._doReset()
        },
        update: function(b) {
            this._append(b);
            this._process();
            return this
        },
        finalize: function(b) {
            b && this._append(b);
            this._doFinalize();
            return this._hash
        },
        clone: function() {
            var b = r.clone.call(this);
            b._hash = this._hash.clone();
            return b
        },
        blockSize: 16,
        _createHelper: function(b) {
            return function(d, f) {
                return b.create(f).finalize(d)
            }
        },
        _createHmacHelper: function(b) {
            return function(d, f) {
                return x.HMAC.create(b, f).finalize(d)
            }
        }
    });
    var x = t.algo = {};
    return t
}(Math);
(function() {
    var e = CryptoJS
      , d = e.lib
      , h = d.WordArray
      , d = d.Hasher
      , c = []
      , a = e.algo.SHA1 = d.extend({
        _doReset: function() {
            this._hash = h.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        },
        _doProcessBlock: function(p, b) {
            for (var r = this._hash.words, l = r[0], i = r[1], m = r[2], o = r[3], t = r[4], q = 0; 80 > q; q++) {
                if (16 > q) {
                    c[q] = p[b + q] | 0
                } else {
                    var s = c[q - 3] ^ c[q - 8] ^ c[q - 14] ^ c[q - 16];
                    c[q] = s << 1 | s >>> 31
                }
                s = (l << 5 | l >>> 27) + t + c[q];
                s = 20 > q ? s + ((i & m | ~i & o) + 1518500249) : 40 > q ? s + ((i ^ m ^ o) + 1859775393) : 60 > q ? s + ((i & m | i & o | m & o) - 1894007588) : s + ((i ^ m ^ o) - 899497514);
                t = o;
                o = m;
                m = i << 30 | i >>> 2;
                i = l;
                l = s
            }
            r[0] = r[0] + l | 0;
            r[1] = r[1] + i | 0;
            r[2] = r[2] + m | 0;
            r[3] = r[3] + o | 0;
            r[4] = r[4] + t | 0
        },
        _doFinalize: function() {
            var g = this._data
              , k = g.words
              , l = 8 * this._nDataBytes
              , i = 8 * g.sigBytes;
            k[i >>> 5] |= 128 << 24 - i % 32;
            k[(i + 64 >>> 9 << 4) + 15] = l;
            g.sigBytes = 4 * k.length;
            this._process()
        }
    });
    e.SHA1 = d._createHelper(a);
    e.HmacSHA1 = d._createHmacHelper(a)
})();
(function() {
    var b = CryptoJS
      , a = b.enc.Utf8;
    b.algo.HMAC = b.lib.Base.extend({
        init: function(q, s) {
            q = this._hasher = q.create();
            "string" == typeof s && (s = a.parse(s));
            var p = q.blockSize
              , e = 4 * p;
            s.sigBytes > e && (s = q.finalize(s));
            for (var c = this._oKey = s.clone(), r = this._iKey = s.clone(), m = c.words, i = r.words, o = 0; o < p; o++) {
                m[o] ^= 1549556828,
                i[o] ^= 909522486
            }
            c.sigBytes = r.sigBytes = e;
            this.reset()
        },
        reset: function() {
            var c = this._hasher;
            c.reset();
            c.update(this._iKey)
        },
        update: function(c) {
            this._hasher.update(c);
            return this
        },
        finalize: function(d) {
            var c = this._hasher
              , d = c.finalize(d);
            c.reset();
            return c.finalize(this._oKey.clone().concat(d))
        }
    })
})();
(function() {
    var h = CryptoJS
      , e = h.lib
      , j = e.Base
      , c = e.WordArray
      , e = h.algo
      , a = e.HMAC
      , d = e.PBKDF2 = j.extend({
        cfg: j.extend({
            keySize: 4,
            hasher: e.SHA1,
            iterations: 1
        }),
        init: function(f) {
            this.cfg = this.cfg.extend(f)
        },
        compute: function(z, B) {
            for (var y = this.cfg, u = a.create(y.hasher, z), x = c.create(), w = c.create([1]), D = x.words, A = w.words, C = y.keySize, y = y.iterations; D.length < C; ) {
                var o = u.update(B).finalize(w);
                u.reset();
                for (var m = o.words, F = m.length, b = o, G = 1; G < y; G++) {
                    b = u.finalize(b);
                    u.reset();
                    for (var E = b.words, n = 0; n < F; n++) {
                        m[n] ^= E[n]
                    }
                }
                x.concat(o);
                A[0]++
            }
            x.sigBytes = 4 * C;
            return x
        }
    });
    h.PBKDF2 = function(g, k, i) {
        return d.create(i).compute(g, k)
    }
})();
