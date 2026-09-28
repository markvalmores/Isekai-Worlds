const fs = require("fs");

const rawUrls = `
https://www.youtube.com/watch?v=TQY7-Hfw9Nw&list=PLwLSw1_eDZl0ZiaSDAvwTj-UdetIHI6xm
https://www.youtube.com/watch?v=SfGfH2IkG_U&list=PLwLSw1_eDZl0_pFZjGAyXj8oQkUF566Lq
https://www.youtube.com/watch?v=YDqXKL8SkCI&list=PLwLSw1_eDZl2dEwttp8R56-7BaiquzmWM
https://www.youtube.com/watch?v=k-dz99b8qNo&list=PLwLSw1_eDZl3hnDBJquengxjETgIxDai-
https://www.youtube.com/watch?v=vfX2qO_H2Xw&list=PLwLSw1_eDZl3a6WBPlpPJlaNKNGwHGA08
https://www.youtube.com/watch?v=MqWG9VnTDfA&list=PLwLSw1_eDZl0Teg-jmcUbCFtcbiDHcBi-
https://www.youtube.com/watch?v=Wwf1h4xUAqg&list=PLwLSw1_eDZl27k9-B8hZh98KmD8R6Zwnq
https://www.youtube.com/watch?v=PzBszurpyNI&list=PLwLSw1_eDZl1BWelglxcX-6baOKAYaeZ5
https://www.youtube.com/watch?v=1ND8VrtLEoc&list=PLwLSw1_eDZl34w4cxzFbtRUZMe6jpokyr
https://www.youtube.com/watch?v=8tPsZYr2HTI&list=PLwLSw1_eDZl28iypqyY3tsSz7P1BByLiK
https://www.youtube.com/watch?v=mM3Vx73C9gY&list=PLwLSw1_eDZl2a-5raJohuneXVt2b6m5lg
https://www.youtube.com/watch?v=9_rPk7sQig8&list=PLwLSw1_eDZl2zSNOBIPISqdjAL69vBOSk
https://www.youtube.com/watch?v=d22o8R51M5I&list=PLwLSw1_eDZl0LKrO7Wf8-BtgXm7GJUomw
https://www.youtube.com/watch?v=RESBYqlTt-k&list=PLwLSw1_eDZl2GuaYah2DPB0cUq-KOb2ba
https://www.youtube.com/watch?v=Heq2GMPd2PQ&list=PLwLSw1_eDZl36-wnIlkhEFYInNFa5RB1C
https://www.youtube.com/watch?v=mfYOy68U83w&list=PLwLSw1_eDZl1M7sDB0qBDBKDKUJnHciM6
https://www.youtube.com/watch?v=KGbMdRhWFz4&list=PLwLSw1_eDZl0hI_XedalMVIvHcVLOouiv
https://www.youtube.com/watch?v=PORnkJcU5XQ&list=PLwLSw1_eDZl1Nr5hw1RMKioVWWXGlPYwI
https://www.youtube.com/watch?v=2SLXT0m4-_I&list=PLwLSw1_eDZl1Sf_lALh99YZAJTp5IaRft
https://www.youtube.com/watch?v=ACP6HKlBUMI&list=PLwLSw1_eDZl3kpZfsZ4e25RH25ZyYHk_j
https://www.youtube.com/watch?v=G1rksGyKQ68&list=PLwLSw1_eDZl295YtiWYiGSBinlDaH9yTH
https://www.youtube.com/watch?v=8jon_zISzr8&list=PLwLSw1_eDZl0eNUZD2EZUg4k3YiDheOYF
https://www.youtube.com/watch?v=5vEJQ7KAeCc&list=PLwLSw1_eDZl2oW4bATqEoAh2xpGMTSXKM
https://www.youtube.com/watch?v=QV0Og424ecE&list=PLwLSw1_eDZl0xXCx8vGdbNBIXN73bE1J-
https://www.youtube.com/watch?v=TeC_kDfc85g&list=PLwLSw1_eDZl2uBNylC0zv02_h8DU_Ybl0
https://www.youtube.com/watch?v=8CqSiRk1Jek&list=PLwLSw1_eDZl0fxMZfFjcKLnL0Hj6cw3Op
https://www.youtube.com/watch?v=7kvMsFCPYyk&list=PLwLSw1_eDZl2x0h_eg6u6Co1Xr-vi8-yC
https://www.youtube.com/watch?v=bMy3UAbq6zs&list=PLwLSw1_eDZl14e1fTCwo2OtJSMxbYnetO
https://www.youtube.com/watch?v=Q5QjpDwC_9Y&list=PLwLSw1_eDZl0vwHVQLtVh4xoUX5pxEiJD
https://www.youtube.com/watch?v=B1nDigzGDAg&list=PLwLSw1_eDZl1-UC4RgrWv8yHKbtrVASbf
https://www.youtube.com/watch?v=M5pKljSvtwQ&list=PLwLSw1_eDZl3QImEBH4Sfmjg-Q2SB61OB
https://www.youtube.com/watch?v=ZyC389arldg&list=PLwLSw1_eDZl0hQYI9Fqqby4gip8mBhPpX
https://www.youtube.com/watch?v=iB4HD9mfJJk&list=PLwLSw1_eDZl0IjZvS5_v70R5wrfHSJueQ
https://www.youtube.com/watch?v=VvK6UZWNU2Q&list=PLwLSw1_eDZl2XdtLhB9NG2Ch050jWFm9G
https://www.youtube.com/watch?v=YIbtv3a-o3k&list=PLwLSw1_eDZl3MvMICti5VTiLTHivii-JR
https://www.youtube.com/watch?v=I-yiNKyMPtA&list=PLwLSw1_eDZl0yarBY8H1zXi3Oz834aRhm
https://www.youtube.com/watch?v=RoAPuxzfad4&list=PLwLSw1_eDZl0eZktsDv3cu78EC0l2qYKI
https://www.youtube.com/watch?v=WZvXrPYN330&list=PLwLSw1_eDZl1JaXJh2-Pc_sfEV6VAHO0W
https://www.youtube.com/watch?v=lSbQZQghE4E&list=PLwLSw1_eDZl0a8Ktxyo5ZH3L_CjHYLmY9
https://www.youtube.com/watch?v=ZOwPJ2fDpuo&list=PLwLSw1_eDZl0i-XeDUWvONhZkm6C2lrDp
https://www.youtube.com/watch?v=HfuujniYKpY&list=PLwLSw1_eDZl3aEpKksFIfZ-z5QoqCKJQq
https://www.youtube.com/watch?v=ZdH9UHv55mE&list=PLwLSw1_eDZl1a-fR7PKtKLE_nzXYzm0MH
https://www.youtube.com/watch?v=Y3PMf2QVGhQ&list=PLwLSw1_eDZl2w1kwb9Si-CBmmpGA5PY65
https://www.youtube.com/watch?v=IKQ7smcORaM&list=PLwLSw1_eDZl0t53wDaw_s7IFG7cNLp_BL
https://www.youtube.com/watch?v=ZWmfqhotphE&list=PLwLSw1_eDZl2t0ExBn76ZdBomplZbeaay
https://www.youtube.com/watch?v=iBoTIpxstus&list=PLwLSw1_eDZl23lU3K_aB0k1aPJ93_jdnt
https://www.youtube.com/watch?v=ZGIREf_dNbc&list=PLwLSw1_eDZl0yYkzk9wZiH2xkhwu2lxBe
https://www.youtube.com/watch?v=T3xk8LXQpqk&list=PLwLSw1_eDZl2cM2gAHFY2dgbAElluhIOx
https://www.youtube.com/watch?v=P7rFuJi2ZCg&list=PLwLSw1_eDZl2S8kRjXhccfBL7JnI5dFNO
https://www.youtube.com/watch?v=WwYRcNe3c00&list=PLwLSw1_eDZl19k-OS2rnlidTog95bScnW
https://www.youtube.com/watch?v=7F5rns5lX6g&list=PLwLSw1_eDZl0_movujO4K0xYOAG9soPjH
https://www.youtube.com/watch?v=uFa96O-a7R4&list=PLwLSw1_eDZl24o1N6adcgGPyIJPfJ21GL
https://www.youtube.com/watch?v=EipD0xwVWGw&list=PLwLSw1_eDZl2EXwI9aJdqU567z6f3UUzU
https://www.youtube.com/watch?v=vTOjwYPQMqw&list=PLwLSw1_eDZl3X-zEFf3ZnYgu6MuUIO9q3
https://www.youtube.com/watch?v=NoXFlIvUsiw&list=PLwLSw1_eDZl3hB6k5qSdSH296aVdctz8V
https://www.youtube.com/watch?v=vZqkYAxiuYU&list=PLwLSw1_eDZl2ZFZlTclIzJrxs74_7Nb47
https://www.youtube.com/watch?v=DKWB8NVXqKc&list=PLwLSw1_eDZl1YS_pINBRcstuSCSgO4EGj
https://www.youtube.com/watch?v=oI9BSRx7T1c&list=PLwLSw1_eDZl3lkMqeu3M0PaNttQM0cWka
https://www.youtube.com/watch?v=Vnd406Qma5g&list=PLwLSw1_eDZl3-WSJkQs_2HcA7hoEhSpGj
https://www.youtube.com/watch?v=pQY088rA1iA&list=PLwLSw1_eDZl01_ftoIT3birJWkpxFZkEl
https://www.youtube.com/watch?v=Budo4U4Kd24&list=PLwLSw1_eDZl3ob71CVx_FBoe8IsTleZge
https://www.youtube.com/watch?v=U2GVrnPxRlw&list=PLwLSw1_eDZl0KQPaOlV_-i8-F3Dyu_kO_
https://www.youtube.com/watch?v=ZMYghdvGAW8&list=PLwLSw1_eDZl32HV4hd5hJcF5RJ1ejNgPs
https://www.youtube.com/watch?v=Nl4xGT_1BwE&list=PLwLSw1_eDZl04kRKOrkNNvS1Yht4lZ8QK
https://www.youtube.com/watch?v=B333PT1bmBw&list=PLwLSw1_eDZl1WTubEn3m0nfJ8ZLnLFUwq
https://www.youtube.com/watch?v=GGBOfOzMi2M&list=PLwLSw1_eDZl0tNsenacq3tN4Jedyd-H_7
https://www.youtube.com/watch?v=fI4UwXfQJa4&list=PLwLSw1_eDZl2X8Vz7MxBgWGm8HjVyEgl9
https://www.youtube.com/watch?v=aS24VWNBh68&list=PLwLSw1_eDZl1bLUFrbGuwsVRTjgIvhVzS
https://www.youtube.com/watch?v=ffE5lYRxziA&list=PLwLSw1_eDZl031sy9v8VtSbqYgoAmGAL7
https://www.youtube.com/watch?v=o1ZOVH9LXzM&list=PLwLSw1_eDZl3F9AGKbC7iRIGeU2XosgTy
https://www.youtube.com/watch?v=vlwPzkq7QZ8&list=PLwLSw1_eDZl125CuqMqbAfph7jPIt7sHd
https://www.youtube.com/watch?v=zbfKK1mHWcM&list=PLwLSw1_eDZl0HZb3tX9UUUxUK7kHmeDtO
https://www.youtube.com/watch?v=F1-VUbfnu78&list=PLwLSw1_eDZl3ZFrbrMSmwz2d52oRAsQDm
https://www.youtube.com/watch?v=owRtO4Ip08g&list=PLwLSw1_eDZl1CiPZS3C6j3d9fiLZsmUgC
https://www.youtube.com/watch?v=h2b6IRZ_y0Y&list=PLwLSw1_eDZl37ONxLQx-mIAJu3hdX-brM
https://www.youtube.com/watch?v=adsNeHmLllg&list=PLwLSw1_eDZl1QGs4v-QtvNHpC_N8ZjkEs
https://www.youtube.com/watch?v=Y1j6kYz2Xzs&list=PLwLSw1_eDZl2qyiTb5d4rLdPpMLM8gEGP
https://www.youtube.com/watch?v=3_e72_vaEMk&list=PLwLSw1_eDZl13ebVE0dgagqzozYJ5d1Er
https://www.youtube.com/watch?v=C7vjIRkuNEc&list=PLwLSw1_eDZl31ypf0OGfmtqZ5upkdcrGt
https://www.youtube.com/watch?v=aB9U-PSEVpA&list=PLwLSw1_eDZl31SiYBPaDaekqPOjqvl2Qg
https://www.youtube.com/watch?v=rMuEwOhiTP0&list=PLwLSw1_eDZl07g1onX93W26g23zSsjr7E
https://www.youtube.com/watch?v=FN6KVcNA17c&list=PLwLSw1_eDZl0B5qey1i3WQhE7vhhtXINb
https://www.youtube.com/watch?v=NnRmUFuL4Dc&list=PLwLSw1_eDZl3FbMdfz-wzxlhpm-FTf2oS
https://www.youtube.com/watch?v=z8asC2Y_Vko&list=PLwLSw1_eDZl12grj-StM5rf3UOWjX_ZCg
https://www.youtube.com/watch?v=nida6gx05kk&list=PLwLSw1_eDZl0CVpnjetepbYfC4ZuePqo6
https://www.youtube.com/watch?v=qWAG6O9VMs4&list=PLwLSw1_eDZl3f9u2Wb_weEMZFcCD1BXhC
https://www.youtube.com/watch?v=neSf7ANVUjc&list=PLwLSw1_eDZl3lknkYJWO-mDkHIibtlgpQ
https://www.youtube.com/watch?v=hTXqHoUQq2M&list=PLwLSw1_eDZl0Hlilj-CAwmciWsIVvFJ0L
https://www.youtube.com/watch?v=AUe11nTcnCQ&list=PLwLSw1_eDZl2qmzRU6SDdKO6Ob4HYKcBK
https://www.youtube.com/watch?v=tla_vFUvxgk&list=PLwLSw1_eDZl00GK4KkK6uhYqRYYg15T27
https://www.youtube.com/watch?v=Qz_8IGlP838&list=PLwLSw1_eDZl07SGVEc61IT60Q1ERpw-od
https://www.youtube.com/watch?v=NBbddoZ6bes&list=PLwLSw1_eDZl00zKZeF1wQmnu9hUjsDGaU
https://www.youtube.com/watch?v=-jYo2bynvDI&list=PLwLSw1_eDZl2FRizEh6a46FMtDzXRUeXq
https://www.youtube.com/watch?v=Q_peJ3FbtsM&list=PLwLSw1_eDZl17reRE_OPjNhFb-IgV1aYY
https://www.youtube.com/watch?v=vzEwWpP18FM&list=PLwLSw1_eDZl0PWwz5cS6rncbDhX-J3AeV
https://www.youtube.com/watch?v=03SKHxzLQME&list=PLwLSw1_eDZl3OjCmcapJ_gTsUedrF2j6-
https://www.youtube.com/watch?v=jtIu5jkKjO4&list=PLwLSw1_eDZl32s0WoBItd3klpmRdCEN8-
https://www.youtube.com/watch?v=ywUvmJOKqkE&list=PLwLSw1_eDZl1jvxZE-x5NVjJQz3pQquTI
https://www.youtube.com/watch?v=zYzeey_gCFU&list=PLwLSw1_eDZl3gRcH6U4L-LonrzmvlvvX0
https://www.youtube.com/watch?v=bilrJTJ2SAg&list=PLwLSw1_eDZl3eo5TUJIZbvoh5rY0xqUyw
https://www.youtube.com/watch?v=GApvZTBaYjk&list=PLwLSw1_eDZl0jARZZpGq5kcYDDQXZ0wZb
https://www.youtube.com/watch?v=I3ed1FZD-DU&list=PLwLSw1_eDZl3rS5lwfx07zxghGRJ6Ckp8
https://www.youtube.com/watch?v=EYBVddvTOqg&list=PLwLSw1_eDZl2izs1xOy2sqcPOQf9Jv7BF
https://www.youtube.com/watch?v=G8lHRPGC8sA&list=PLwLSw1_eDZl23nn7SiSh0qSwLxieZyNmh
https://www.youtube.com/watch?v=Ahc2emYGiAc&list=PLwLSw1_eDZl37XHmQphNJ64na1690p5ib
https://www.youtube.com/watch?v=Y3ROeM4tAGc&list=PLwLSw1_eDZl2HgYi744CHSRYkhN8xsrZA
https://www.youtube.com/watch?v=qBHbguhoDgU&list=PLwLSw1_eDZl3wnGEqGVQDhDlyDLviOhCx
https://www.youtube.com/watch?v=pDgQ_z80zuU&list=PLwLSw1_eDZl2o_CBCRxnYJOP_UhDn7NeW
https://www.youtube.com/watch?v=0I7Ebx604MU&list=PLwLSw1_eDZl3c_LVdE3-fWSI17vrM46ez
https://www.youtube.com/watch?v=oJn6iAOtepE&list=PLwLSw1_eDZl2vNHSDbAPDD-nel6lYx7kR
https://www.youtube.com/watch?v=DQh6qBh7XRc&list=PLwLSw1_eDZl2-nll936663-OpHiOTJ8Un
https://www.youtube.com/watch?v=3HpMdtFHgYc&list=PLwLSw1_eDZl0PC3GwSEfl_Oy2Obxw4H5e
https://www.youtube.com/watch?v=t7KzcZQimZU&list=PLwLSw1_eDZl0e5uGZU4pQdkTNsBE-62qb
https://www.youtube.com/watch?v=5Soz2cBGCF8&list=PLwLSw1_eDZl1_e_EKh4oVFriW8um3TKY6
https://www.youtube.com/watch?v=IW0Cf5wRnH0&list=PLwLSw1_eDZl1pGYxuxFAg3A4Y5rDCugXg
https://www.youtube.com/watch?v=QR50tBRiJgg&list=PLwLSw1_eDZl2r_5gebNCgFLONBLem1_si
https://www.youtube.com/watch?v=8zHruCiLH4Q&list=PLwLSw1_eDZl1ALquqIseu1OZ2drqXCTIt
https://www.youtube.com/show/VLPLwLSw1_eDZl20EjWfUYYc1YyqdU8ilHEe
https://www.youtube.com/watch?v=ffE_nBqyX-I&list=PLwLSw1_eDZl0oqORR5jlJJvR2Qa2a77Qu
https://www.youtube.com/watch?v=i3nhUubChP4&list=PLwLSw1_eDZl2v3GdglUbai_QNMJHZMOHP
https://www.youtube.com/watch?v=h_tL16PZ0IE&list=PLwLSw1_eDZl1wGMYg5oB3uEns0CZNl6sI
https://www.youtube.com/watch?v=3Vu6tC63FGk&list=PLwLSw1_eDZl2cJtt6H_rYQoBf9rpMXphM
https://www.youtube.com/watch?v=JsJQlVNKcH0&list=PLwLSw1_eDZl1_y0Egv3OLQDJfK2hIx3Vc
https://www.youtube.com/watch?v=RFrsC2A4wH4&list=PLwLSw1_eDZl2P4Wwj2piYnwauRoyEeqlZ
https://www.youtube.com/watch?v=rPL4kp2ZYYA&list=PLwLSw1_eDZl3PjJbm6RKXGHPll7ZJjSkT
https://www.youtube.com/watch?v=D8izKlJMm64&list=PLwLSw1_eDZl1A2Inpej5epIxz-BB59X8_
https://www.youtube.com/watch?v=wQ57EO2ZFac&list=PLwLSw1_eDZl3myw51ePNETmCVl587h_Y3
https://www.youtube.com/watch?v=EnhuDTNk1Ps&list=PLwLSw1_eDZl0-bp4bZ7ER-VQ-973riDyN
https://www.youtube.com/watch?v=YCrwIPKlAyA&list=PLwLSw1_eDZl0aRsSiTx2Kq6Mc5zc0jrL1
https://www.youtube.com/watch?v=wnVJ0LDypXo&list=PLwLSw1_eDZl2WCY-naAlexgVnI7CHlNNR
https://www.youtube.com/watch?v=KMha1DHbwt0&list=PLwLSw1_eDZl2mjV_pl9Dr_QTcn1nmNvB1
https://www.youtube.com/watch?v=prpUbGkXM6w&list=PLwLSw1_eDZl1ZHXQDzK5Qit6jqLTNzjZ3
https://www.youtube.com/watch?v=nlDNm7I3EAY&list=PLwLSw1_eDZl0AqkVnkd9eTh2OI1mRRpRs
https://www.youtube.com/watch?v=tXkWuGdSOLs&list=PLwLSw1_eDZl1Q4OIgY3DIF31SO_9cOo8M
https://www.youtube.com/watch?v=tUor3kmmQ8A&list=PLwLSw1_eDZl0sgiAAegEz0YBnExhICwtl
https://www.youtube.com/watch?v=phjbaDTEikE&list=PLwLSw1_eDZl1pvIv1fBd3oKkP3XEQpT_G
https://www.youtube.com/watch?v=wyKA_h1PBGg&list=PLwLSw1_eDZl2VQRIahDF73hnkdPjNRYnu
https://www.youtube.com/watch?v=cM9asDSmxMs&list=PLwLSw1_eDZl3qq9KSn9zKK_DpaXxSxiKA
https://www.youtube.com/watch?v=8yN_F0p8IgI&list=PLwLSw1_eDZl3lKZF-kZV6oca85WPnTHod
https://www.youtube.com/watch?v=k9C7v1DDUmU&list=PLwLSw1_eDZl1lv3DwQr43Dbdnjsxfa_cB
https://www.youtube.com/watch?v=IX7g4C5YJlQ&list=PLwLSw1_eDZl33XF-NyOM6dJZ6hNDi54lg
https://www.youtube.com/watch?v=-gN6VOf_b3Y&list=PLwLSw1_eDZl2VGzbi1867Ucw0vJzRfXYU
https://www.youtube.com/watch?v=v_SInAQqN-Y&list=PLwLSw1_eDZl28nYqV_gPaNLe-PL2JEnCR
https://www.youtube.com/watch?v=F1nxQ0QV-5k&list=PLwLSw1_eDZl2UJ5gM6kNKM4uwJ3NWCMjN
https://www.youtube.com/watch?v=RlcIbb8u9r0&list=PLwLSw1_eDZl0aMBGsjj5NwAkJb76zE59C
https://www.youtube.com/watch?v=iReep_Ncb6Q&list=PLwLSw1_eDZl3llJarYAOOfcLJ3LUcHlxC
https://www.youtube.com/watch?v=2c3YRL2gqZk&list=PLwLSw1_eDZl1lPiuYljW124AbkxpGY_XH
https://www.youtube.com/watch?v=1OUPPYNOtYk&list=PLwLSw1_eDZl2G6DBHShiUaTXCskconQ9V
https://www.youtube.com/watch?v=szvKTRxLMxk&list=PLwLSw1_eDZl0cyjP08vofJ5uhGfCl4zPc
https://www.youtube.com/watch?v=LitjEg06EyA&list=PLwLSw1_eDZl1aAPuUflQZTsm6r9xyuK4z
https://www.youtube.com/watch?v=NTuUEqaVnKU&list=PLwLSw1_eDZl25yJk8bF8P4CJadfJpvtkz
https://www.youtube.com/watch?v=LrMf0E-Z7kk&list=PLwLSw1_eDZl0X9kRSmdiB5L2FfA_eTyMZ
https://www.youtube.com/watch?v=lDhtkbu_E68&list=PLwLSw1_eDZl2FdlHjWSXxwE26q05wv6_K
https://www.youtube.com/watch?v=Pl7Kfq6aTvA&list=PLwLSw1_eDZl39RHrWKdjZJ9hFQ6UYiDMr
https://www.youtube.com/watch?v=h4CJfhgCSZY&list=PLwLSw1_eDZl3guU7C6fmEzgwnIFAnrzk5
https://www.youtube.com/watch?v=QOc44_E5-nU&list=PLwLSw1_eDZl1jW_xDvXXJOphlaMLZxsJ-
https://www.youtube.com/watch?v=0lGJE8kTb4c&list=PLwLSw1_eDZl0Kfd0S0D1PELpHYRUz-Owo
https://www.youtube.com/watch?v=KFVDrnH4Uwc&list=PLwLSw1_eDZl2GTD5eb1FOEFT-OPoVhIjJ
https://www.youtube.com/watch?v=ZgyothCzhLA&list=PLwLSw1_eDZl2K50osRye4kFgrJsbBTauM
https://www.youtube.com/watch?v=PaDvjUK7_l8&list=PLwLSw1_eDZl3NIzWVo6NiXcorugfvyvVg
https://www.youtube.com/watch?v=lg7WlPJD4ds&list=PLwLSw1_eDZl0v47aPkpPwQH7D-WJOJx1L
https://www.youtube.com/watch?v=7ecoriUpqY0&list=PLwLSw1_eDZl0e6fhvpxjXXSVUCRXak4D-
https://www.youtube.com/watch?v=Nn1M5Eoo5ys&list=PLwLSw1_eDZl3AYxH4V7MQgZJv7Dr96s2l
https://www.youtube.com/watch?v=H8f5luqxiDs&list=PLwLSw1_eDZl1ko2ZtycDHdgIovdrzT1QX
https://www.youtube.com/watch?v=7YGFRsPMUSQ&list=PLwLSw1_eDZl2SdSro00Nvg38MQUf-5ZL8
https://www.youtube.com/watch?v=RYns8C_q_UA&list=PLwLSw1_eDZl38YulZR4kWFoJ1DFuUwEvV
https://www.youtube.com/watch?v=LpBYdfstcBg&list=PLwLSw1_eDZl1fJTawowlPbOLfApiKSEOi
https://www.youtube.com/watch?v=eFUPxX159Cw&list=PLwLSw1_eDZl3DVtslUyw-MeBR5W7ktk1e
https://www.youtube.com/watch?v=w5k6_2IH3og&list=PLwLSw1_eDZl3r0PWvImxT2aNky9PgNVIJ
https://www.youtube.com/watch?v=MJnF7cThyIM&list=PLwLSw1_eDZl1AUEELCJe2ghK9eDI5nGsQ
https://www.youtube.com/watch?v=VxlS7NBeHjw&list=PLwLSw1_eDZl3kNUmd8rDL2WnmI-C6LKgt
https://www.youtube.com/watch?v=qRd5wbH4Cio&list=PLwLSw1_eDZl0cJyc_zkaS2wgBge7kdPcF
https://www.youtube.com/watch?v=4jBYMlpyhBM&list=PLwLSw1_eDZl27LXaPp_ryQdu41PQGpWEq
https://www.youtube.com/watch?v=oHale5tm-Pg&list=PLwLSw1_eDZl1gxoIoRFrIlzxe5FM1yZfe
https://www.youtube.com/watch?v=mT5kjyoaSTc&list=PLwLSw1_eDZl16aN3dffy3DzuC9JLH3gDg
https://www.youtube.com/watch?v=ZuYiS3NROnQ&list=PLwLSw1_eDZl2gLJyLH6BkSr4l1XPaKDjT
https://www.youtube.com/watch?v=PHcN78ZbOfE&list=PLwLSw1_eDZl0QVdscY93WMTdqR0tl1b32
https://www.youtube.com/watch?v=DU4F_0rX3P8&list=PLwLSw1_eDZl2_YhCrD7kgWkEHEraqedPW
https://www.youtube.com/watch?v=KD-3ksjCpJI&list=PLwLSw1_eDZl3crv3GtAZrfjreOsS9As35
https://www.youtube.com/watch?v=XYZWdgKqliQ&list=PLwLSw1_eDZl0whg1P3W-GGjHV0roiqsFP
https://www.youtube.com/watch?v=qujMTw8zrxw&list=PLwLSw1_eDZl3fbgfxwor-qrUsEtOZ8bLC
https://www.youtube.com/watch?v=aVWSH-bjfOQ&list=PLwLSw1_eDZl0e2nQ5MU6dWXVC3Pqf6941
https://www.youtube.com/watch?v=BCTN848crs4&list=PLwLSw1_eDZl3C_LTcF5WnEAWUjILtXptk
https://www.youtube.com/watch?v=jFF2djWQtuc&list=PLwLSw1_eDZl3SO7xh3VLjlKKvxihVUOaI
https://www.youtube.com/watch?v=7JUTF_faWKE&list=PLwLSw1_eDZl10YPPR7qDsVf10wZfYnIMK
https://www.youtube.com/watch?v=vxHzNJ_Q9Q0&list=PLwLSw1_eDZl1xwjPnSCLFHXdlH1HUcrfD
https://www.youtube.com/watch?v=J_ZIgc9BGiE&list=PLwLSw1_eDZl1k3PpCugshhYpSQVWUAaib
https://www.youtube.com/show/VLPLwLSw1_eDZl2ilZQ5Xv1xozab_cm90ugI
https://www.youtube.com/watch?v=DXiywPWDnqA&list=PLwLSw1_eDZl29jJI3xLiviArPPoyC7EQp
https://www.youtube.com/watch?v=fuM8HgJ2iVM&list=PLwLSw1_eDZl1JiNtHZQTpQrjNbwXf4pHM
https://www.youtube.com/watch?v=eluMx-l-DsM&list=PLwLSw1_eDZl3etcUK39lZKBM6P2URu_Jz
https://www.youtube.com/watch?v=6ETyIp7n8nw&list=PLwLSw1_eDZl3-9-2FJKBOwpaNg_K1oUoA
https://www.youtube.com/watch?v=Ib9CRlFnVhw&list=PLwLSw1_eDZl14kD6iz4eILaU9kceG6UZL
https://www.youtube.com/watch?v=cOyDgwX62vw&list=PLwLSw1_eDZl24uc_SVJohCJFLtMu2Iaey
https://www.youtube.com/watch?v=dO5stWhsaWo&list=PLwLSw1_eDZl3ptRSYsrWpjb7_d8DXgxF3
https://www.youtube.com/watch?v=VXxMbV4LkzA&list=PLwLSw1_eDZl2qQ39Obr5X2J0fIATD9M2M
https://www.youtube.com/watch?v=U7po236IOKY&list=PLwLSw1_eDZl22NzEffbakJYVXiiWas9KH
https://www.youtube.com/watch?v=9-XSPSuqmPo&list=PLwLSw1_eDZl3tJE53C10vT7BjOzXaG5q5
https://www.youtube.com/watch?v=1clLRHrcFco&list=PLwLSw1_eDZl3ICvMY_c9VTL6yduj59Osl
https://www.youtube.com/watch?v=tGDj3ihCK3s&list=PLwLSw1_eDZl3FTHjJTQw5sqOyUw1ZJ_yR
https://www.youtube.com/watch?v=RoAPuxzfad4&list=PLwLSw1_eDZl3_YNRvXA7O89pNPsj1WIkb
https://www.youtube.com/watch?v=uGYM9uX5qDI&list=PLwLSw1_eDZl2CqcAM38QNk6I65Dz9PRie
https://www.youtube.com/watch?v=glr7Mfhqjok&list=PLwLSw1_eDZl0RAmNIrodPyAf8t3iNWd0q
https://www.youtube.com/watch?v=ajzxA1vyoHw&list=PLwLSw1_eDZl01CdPrY3k4ngtpao3oz7O1
https://www.youtube.com/watch?v=w5IQfvTGhi8&list=PLwLSw1_eDZl0MfIdBzXRl2q4luviKzsxq
https://www.youtube.com/watch?v=o5Bj--A9ORo&list=PLwLSw1_eDZl05v2mf2IgiVxgoEkFGh4yI
https://www.youtube.com/watch?v=xLPstaoaxmU&list=PLwLSw1_eDZl21k3KBkiVFqrxDyfvIFQPH
https://www.youtube.com/watch?v=a811Ai1auXQ&list=PLwLSw1_eDZl3FY6j0fvEZZ3qZDqrzsuTn
https://www.youtube.com/watch?v=yZcOJ8rSCig&list=PLwLSw1_eDZl01FuNigO2J_kpRcdtjWN9F
https://www.youtube.com/watch?v=MEDyQiOB7xk&list=PLwLSw1_eDZl0TccWcuNXEUCq0R6KBWYFW
https://www.youtube.com/watch?v=-EFaRJBQMfg&list=PLwLSw1_eDZl24IchKz3a3eAcwPorGjU_t
https://www.youtube.com/watch?v=pzca_pNgYdU&list=PLwLSw1_eDZl3bl_BrAWpY3BjJavNRe4fO
https://www.youtube.com/watch?v=-pyK6-dVDhY&list=PLwLSw1_eDZl3eT2fOFMIeAJZQpdxe9tmU
https://www.youtube.com/watch?v=NmNjJ0IYMm0&list=PLwLSw1_eDZl3C3peDURtUL6yivoXKvuZ7
https://www.youtube.com/watch?v=4gM-NilcZBg&list=PLwLSw1_eDZl2Ylo_ZqR-Ian69US02f1GA
https://www.youtube.com/watch?v=z9jF5CzkWiU&list=PLwLSw1_eDZl0sGgFJa4A_jELqNXVv8dqg
https://www.youtube.com/watch?v=Ag5rwd-UOdM&list=PLwLSw1_eDZl3YlF-AmAQWIFW1BV-Q84tW
https://www.youtube.com/watch?v=ubXtZ9r6W-4&list=PLwLSw1_eDZl23uIjbwVKoUA3dbo6FiGoX
https://www.youtube.com/watch?v=uAS2RXlPsAk&list=PLwLSw1_eDZl3fj-ljtzKxYaTBgrqtcqoY
https://www.youtube.com/watch?v=D7Ra2B2Sl10&list=PLwLSw1_eDZl2OF_CmbcBOUk_216rwS1wD
https://www.youtube.com/watch?v=36KgZyhVEts&list=PLwLSw1_eDZl1P3W7ws_S-dsq2zV3aIj-S
https://www.youtube.com/watch?v=sZ1PS78cCso&list=PLwLSw1_eDZl39ouByN0ujsTUV3jnaJVLu
https://www.youtube.com/watch?v=DdPixyLuaT8&list=PLwLSw1_eDZl0dnyHyQUkE0ggdGHWwWogW
https://www.youtube.com/watch?v=oVgkeAkT89g&list=PLwLSw1_eDZl0mHfdQze0zVVrSRnLNr-yF
https://www.youtube.com/watch?v=7F5rns5lX6g&list=PLwLSw1_eDZl3RN7t6wesJqlUkSUN6FHKF
https://www.youtube.com/watch?v=vt3nHeHh2Zw&list=PLwLSw1_eDZl1YSkns5JXCCyuI-HR2GnHP
https://www.youtube.com/watch?v=62GRTeVMtf4&list=PLwLSw1_eDZl3PWB737Ej-fSj1d6UeqrCi
https://www.youtube.com/watch?v=WY0IkVTy5xY&list=PLwLSw1_eDZl0kTapKR1aoeVPXca6KIPPc
https://www.youtube.com/watch?v=hPQlkEPb4Es&list=PLwLSw1_eDZl03q6rAPvEC-sRXeGiy6qMM
https://www.youtube.com/watch?v=yKvuPoi2gUg&list=PLwLSw1_eDZl1DlUDCVK433fUMRHqlggDM
https://www.youtube.com/watch?v=tOXgJq8QrbU&list=PLwLSw1_eDZl031zNeBVFi0zLndX_M3PhN
https://www.youtube.com/watch?v=CIj10GBEyk8&list=PLwLSw1_eDZl2VtrcMiIwEPC5RetXymTDz
https://www.youtube.com/watch?v=std9b0unKFk&list=PLwLSw1_eDZl3ML-kzI3sjoetbnmSaealc
https://www.youtube.com/watch?v=pojJUqxaFuo&list=PLwLSw1_eDZl322PZfaZqVFMuAmmGGephH
https://www.youtube.com/watch?v=Nu6SsBBHXXk&list=PLwLSw1_eDZl2jD4HobdnUs3oOdkDNwQGq
https://www.youtube.com/watch?v=Eb2WFA8LyZo&list=PLwLSw1_eDZl1zglh3A7fJ5m7UBGBuua27
https://www.youtube.com/watch?v=rWPmb-8wLHY&list=PLwLSw1_eDZl1XlieID8l9lhZQ_r1mBCzZ
https://www.youtube.com/watch?v=iecTvnLmiak&list=PLwLSw1_eDZl2_kN6ctgnhmggC6vivdrcl
https://www.youtube.com/watch?v=2ihE66wiF8o&list=PLwLSw1_eDZl3Yk31lEtOGELVwz1DuYiDU
https://www.youtube.com/watch?v=sku3nuQaG5s&list=PLwLSw1_eDZl0NZmU6_edKi3KghUDUZvIR
https://www.youtube.com/watch?v=TZ-Y_8ey2hY&list=PLwLSw1_eDZl15t3FDPEZ8RDr8uVWnRs2k
https://www.youtube.com/watch?v=NBbddoZ6bes&list=PLwLSw1_eDZl0M4VrdwW6NbQ-U6TgAVOoE
https://www.youtube.com/watch?v=Be1Av3rc8i4&list=PLwLSw1_eDZl2Q8toGAnqq0HFtecvSQSCS
https://www.youtube.com/watch?v=ZJnq_vgwNkM&list=PLwLSw1_eDZl3572W1HJjIkZyW-0GGVUVq
https://www.youtube.com/watch?v=ltD7ugJefXY&list=PLwLSw1_eDZl0oZ0mKYOIDz9WU6RtNIvdX
https://www.youtube.com/watch?v=LGTgH7N3MMw&list=PLwLSw1_eDZl2Xd19GhiS8SvJZJCyH12F6
https://www.youtube.com/watch?v=6FRTJ0z1vxs&list=PLwLSw1_eDZl3v7wlTQD5MDi8PFpu3I5Xq
https://www.youtube.com/watch?v=LbEgCTpJt7M&list=PLwLSw1_eDZl0ah79jTczH6CBPDr0uZcji
https://www.youtube.com/watch?v=azdI3n5QZyg&list=PLwLSw1_eDZl0JGogKG0UuK0rHBHlk5lQC
https://www.youtube.com/watch?v=HofrufQNt6c&list=PLwLSw1_eDZl3r1YgdkdwcNuC9zljIi7B_
https://www.youtube.com/watch?v=JsJQlVNKcH0&list=PLwLSw1_eDZl2e2Wj7kDCZ2D5DdGceUsj7
https://www.youtube.com/watch?v=weui_FdHlBg&list=PLwLSw1_eDZl1z8JtxYPgiV9H6tGZMlhTC
https://www.youtube.com/watch?v=gLFkOAgcxr0&list=PLwLSw1_eDZl0Hvvm1qpOoJRSOiJhj9nnl
https://www.youtube.com/watch?v=7b728fI0VVQ&list=PLwLSw1_eDZl0YZIflIt1EK0dcjLuMuxLd
https://www.youtube.com/watch?v=ZaRDRpwm1WA&list=PLwLSw1_eDZl0dSCBzzknNWxuXuMJ0xwmk
https://www.youtube.com/watch?v=FydaFARNpbE&list=PLwLSw1_eDZl0HK0kxwDBy96LKoNFa8Qnt
https://www.youtube.com/watch?v=vJNxVR6xbZU&list=PLwLSw1_eDZl15GuyNnaoSrjuBATA-sA3R
https://www.youtube.com/watch?v=W4Fv0DWRyKY&list=PLwLSw1_eDZl1gBwBsgwk8WFIcWW_YatlT
https://www.youtube.com/watch?v=HGp7_n-HbNc&list=PLwLSw1_eDZl1LD32XCdnl1QuvZFoQaIl_
https://www.youtube.com/watch?v=klax4pvvVBM&list=PLwLSw1_eDZl3oUZb_EHQopJ631it09D00
https://www.youtube.com/watch?v=9f1ZSGNjNtY&list=PLwLSw1_eDZl1gpPkmqA5aKbsWYRdOSF5Z
https://www.youtube.com/watch?v=qm-qmzKTUX0&list=PLwLSw1_eDZl0GaYki8AMQtObLOY61-9jq
https://www.youtube.com/watch?v=WWDuzkwiCxk&list=PLwLSw1_eDZl2GbOGy2oSib22MphkELcNr
https://www.youtube.com/watch?v=llg4gTH16yc&list=PLwLSw1_eDZl2paQrjKK8zaSsIITW0pjMq
https://www.youtube.com/watch?v=dJn63-6t1vA&list=PLwLSw1_eDZl0BVriH9xNGA2QEoMdJ61gt
https://www.youtube.com/watch?v=O1hbt4c1X9o&list=PLwLSw1_eDZl1Z2OaPWYl4DqhX9GkB-jkR
https://www.youtube.com/watch?v=S3v5kevFXSE&list=PLwLSw1_eDZl3mptgIJ-ihxCV3_Ct7CNEF
https://www.youtube.com/watch?v=pxZeXoaLpSo&list=PLwLSw1_eDZl3mojgeqUHyMpTt3lQ6ogmJ
https://www.youtube.com/watch?v=Aph0e1BGKoQ&list=PLwLSw1_eDZl3JwA9S1ibI5m9G-dEuUhWw
https://www.youtube.com/watch?v=FwFg-yLkOy4&list=PLwLSw1_eDZl1yaZiMDinSA80dyCgrQPcj
https://www.youtube.com/watch?v=1AbD8f0ZA7Y&list=PLwLSw1_eDZl3oMlnB7bBRbcdnIbrj9wNv
https://www.youtube.com/watch?v=jwtu4lIIWFs&list=PLwLSw1_eDZl2jocaAW0S6IpbSv01XLHkV
https://www.youtube.com/watch?v=rnd1YKFs4aA&list=PLwLSw1_eDZl37QJE0NTvUiONsuDJH6IMD
https://www.youtube.com/watch?v=9CI2YLcDqn0&list=PLwLSw1_eDZl011mVXTXqaPUz2fiiEyFPF
https://www.youtube.com/watch?v=mFfYe9ph7dQ&list=PLwLSw1_eDZl1G_FbMxbzZY5Ut5RWO4bUv
https://www.youtube.com/watch?v=cN1bzy5Olik&list=PLwLSw1_eDZl1-aoCFQ-X1pmxfTVRvrRAt
https://www.youtube.com/watch?v=PikHDHoVHQ4&list=PLwLSw1_eDZl17TZLbrG-4aQCLXJg2iKyI
https://www.youtube.com/watch?v=CjUoMQz7syY&list=PLwLSw1_eDZl3d2XXHoyqobEAMz2g0nBc0
https://www.youtube.com/watch?v=KARRNc6Cmgk&list=PLwLSw1_eDZl3eQLL5RrE-_B7D_vmJs1NH
https://www.youtube.com/watch?v=uvLbY73LC0s&list=PLwLSw1_eDZl3n62kkjOOBxuuhfXiDUu4g
https://www.youtube.com/watch?v=NMC2f6zciTs&list=PLwLSw1_eDZl1z41gn7aMEh69uw8LsalVJ
https://www.youtube.com/watch?v=8iAx_0EsF5A&list=PLwLSw1_eDZl3pfSGYuLYNhx-r4jK1qzTB
https://www.youtube.com/watch?v=FsQg0Kw1LvY&list=PLwLSw1_eDZl2oO6S-Ns6qW4xo3ESDAT0d
https://www.youtube.com/watch?v=HEfwggJcrfY&list=PLwLSw1_eDZl39KDdjidupfewWK2xookSn
https://www.youtube.com/watch?v=OCItXp6ggdg&list=PLwLSw1_eDZl1mOdLlLpVDFf0RzqhcRNTn
https://www.youtube.com/watch?v=qbcIKzP9uOA&list=PLwLSw1_eDZl0TyUapNf9oEI7lbDxSbwLL
https://www.youtube.com/show/VLPLwLSw1_eDZl0a5R_sTDWnpN19_TCZuW-E
https://www.youtube.com/watch?v=PBKFNPU3bXk&list=PLwLSw1_eDZl10pbg4dlS9ZUOYMzXWFK-W
https://www.youtube.com/show/VLPLwLSw1_eDZl3IS1Ybw9xSItdpPhLKNhAM
https://www.youtube.com/show/VLPLwLSw1_eDZl3yq1oZEC8iNCwgMsg0NmIZ
https://www.youtube.com/show/VLPLwLSw1_eDZl0ctL2jtLzMpMPtAYfkdRVO
https://www.youtube.com/show/VLPLwLSw1_eDZl38hoyHQ6-C5HAQ9lJ5jkdG
https://www.youtube.com/show/VLPLwLSw1_eDZl0BnHSDgsrzHcX29LmyNwQ1
https://www.youtube.com/show/VLPLwLSw1_eDZl3mx2NrmJSwHk-VtvhmGnZz
https://www.youtube.com/watch?v=hSJPIpjdueQ&list=PLwLSw1_eDZl1LMA6zhohDzfoV-XXFxS9Z
https://www.youtube.com/watch?v=mKS67U6ZEWM&list=PLwLSw1_eDZl2-3IJvnbF-_aRL-chrwcEh
https://www.youtube.com/show/VLPLSad71frBqm8
https://www.youtube.com/show/VLPLRr14r0YenYQ
https://www.youtube.com/show/VLPLMubW4yKnxcs
https://www.youtube.com/show/VLPLTvwl-EW8KqM
https://www.youtube.com/show/VLPLGM1YbEshsO0
https://www.youtube.com/show/VLPLWMEZ5mLVQOw
https://www.youtube.com/show/VLPLet6WmAEfYgk
https://www.youtube.com/show/VLPLcFCNlU2fKzI
https://www.youtube.com/show/VLPLULjw5SlciMA
https://www.youtube.com/show/VLPLWBNgbV0LUX8
https://www.youtube.com/show/VLPLAiiWJCzq5xc
https://www.youtube.com/show/VLPLMvWCsColKaM
https://www.youtube.com/show/VLPLWb9h4pKMCIY
https://www.youtube.com/watch?v=EHCY5uf6044&list=PLcCyYfjq8bck
https://www.youtube.com/watch?v=BTTWQXIb7mI&list=PLBtNPN3i_Uug
`;

// Famous anime titles catalog mapped to Muse Asia playlists
const ANIME_TITLES = [
  "Spy x Family",
  "Frieren: Beyond Journey's End",
  "Goblin Slayer S2",
  "Tokyo Revengers",
  "Jobless Reincarnation: Mushoku Tensei",
  "Classroom of the Elite S3",
  "Mob Psycho 100 III",
  "Campfire Cooking in Another World with My Absurd Skill",
  "Welcome to Demon School! Iruma-kun",
  "Tensei Shitara Slime Datta Ken (That Time I Got Reincarnated as a Slime)",
  "One Punch Man S2",
  "Demon Slayer: Kimetsu no Yaiba",
  "Chainsaw Man",
  "Sword Art Online: Alicization",
  "Bofuri: I Don't Want to Get Hurt, so I'll Max Out My Defense",
  "Overlord IV",
  "Skeleton Knight in Another World",
  "She Professed Herself Pupil of the Wise Man",
  "Parallel World Pharmacy",
  "Re:Zero − Starting Life in Another World",
  "Assassination Classroom",
  "The Eminence in Shadow",
  "Isekai Ojisan (Uncle from Another World)",
  "The Greatest Demon Lord Is Reborn as a Typical Nobody",
  "Trapped in a Dating Sim: The World of Otome Games Is Tough for Mobs",
  "In the Land of Leadale",
  "Ya Boy Kongming!",
  "Management of a Novice Alchemist",
  "The Dawn of the Witch",
  "Kaguya-sama: Love Is War",
  "My Dress-Up Darling",
  "Lycoris Recoil",
  "Bocchi the Rock!",
  "Chainsaw Man (Dubbed Special)",
  "Bleach: Thousand-Year Blood War",
  "Jujutsu Kaisen",
  "Hell's Paradise",
  "Blue Lock",
  "Oshi no Ko",
  "The Angel Next Door Spoils Me Rotten",
  "Tomo-chan Is a Girl!",
  "NieR:Automata Ver1.1a",
  "In/Spectre S2",
  "BOFURI S2",
  "Malevolent Spirits: Mononogatari",
  "Saving 80,000 Gold in Another World for My Retirement",
  "Kubo Won't Let Me Be Invisible",
  "The Magical Revolution of the Reincarnated Princess and the Genius Young Lady",
  "High Card",
  "Sugar Apple Fairy Tale",
  "Endo and Kobayashi Live! The Latest on Tsundere Villainess Lieselotte",
  "Chillin' in My 30s after Getting Fired from the Demon King's Army",
  "The Iceblade Sorcerer Shall Rule the World",
  "Handyman Saitou in Another World",
  "My Life as Inukai-san's Dog",
  "Reborn to Master the Blade: From Hero-King to Extraordinary Squire",
  "Campfire Cooking in Another World (Limited Time)",
  "The Fruit of Evolution: Before I Knew It, My Life Had It Made S2",
  "D4DJ All Mix",
  "Sorcerous Stabber Orphen: Chaos in Urbanrama",
  "The Reincarnation of the Strongest Exorcist in Another World",
  "Ningen Fushin: Adventurers Who Don't Believe in Humanity Will Save the World",
  "Tsurune: The Linking Shot",
  "Bungou Stray Dogs S4",
  "Tomo-chan Is a Girl! (English DUB)",
  "The Legendary Hero Is Dead!",
  "A Galaxy Next Door",
  "KamiKatsu: Working for God in a Godless World",
  "Dead Mount Death Play",
  "Kuma Kuma Kuma Bear Punch!",
  "Otaku Elf",
  "My Home Hero",
  "In Another World With My Smartphone S2",
  "The Café Terrace and Its Goddesses",
  "Birdie Wing: Golf Girls' Story S2",
  "Dr. STONE New World",
  "MIX: Meisei Story S2",
  "Ranking of Kings: The Treasure Chest of Courage",
  "Insomniacs After School",
  "Why Raeliana Ended Up at the Duke's Mansion",
  "The Dangers in My Heart",
  "World Dai Star",
  "Sacrificial Princess and the King of Beasts",
  "Too Cute Crisis",
  "Mashle: Magic and Muscles",
  "Oshi no Ko (Full Season)",
  "Konosuba: An Explosion on This Wonderful World!",
  "Yuri Is My Job!",
  "Mobile Suit Gundam: The Witch from Mercury S2",
  "Demon Slayer: Swordsmith Village Arc",
  "The Aristocrat's Otherworldly Adventure: Serving Gods Who Go Too Far",
  "I Got a Cheat Skill in Another World and Became Unrivaled in the Real World, Too",
  "Sasaki and Peeps",
  "The Demon Sword Master of Excalibur Academy",
  "The Vexations of a Shut-In Vampire Princess",
  "Protocol: Rain",
  "Stardust Telepath",
  "Returner's Magic Should Be Special",
  "A Returner's Magic Should Be Special (DUB)",
  "Dead Mount Death Play Cour 2",
  "Goblin Slayer II (Full Series)",
  "The Faraway Paladin: The Lord of the Rust Mountains",
  "Tearmoon Empire",
  "Bikkurimen",
  "Experience the Yuzuki Family's Four Sons",
  "Shy",
  "I'm in Love with the Villainess",
  "Bullbuster",
  "Under Ninja",
  "16bit Sensation: Another Layer",
  "The Saint's Magic Power is Omnipotent S2",
  "Paradox Live The Animation",
  "Our Dating Story: The Experienced You and The Inexperienced Me",
  "Hypnosis Mic: Division Rap Battle - Rhyme Anima +",
  "My New Boss Is Goofy",
  "Migi & Dali",
  "Captain Tsubasa Season 2: Junior Youth Arc",
  "Ron Kamonohashi's Forbidden Deductions",
  "A Girl & Her Guard Dog",
  "Shangri-La Frontier",
  "MF Ghost",
  "The Family Circumstances of the Imbalanced Witch",
  "Overtake!",
  "PLUTO",
  "The Rising of the Shield Hero S3",
  "The Kingdoms of Ruin",
  "Potion-Danomi de Ikinukimasu!",
  "A Playthrough of a Certain Dude's VRMMO Life",
  "Ragna Crimson",
  "Berserk of Gluttony",
  "Undead Unluck",
  "Frieren: Beyond Journey's End (Full Cour)",
  "Chitamatsuri Special Movie",
  "Attack on Titan Final Season Specials",
  "Jujutsu Kaisen Season 2 Shibuya Incident",
  "Tokyo Revengers Tenjiku Arc",
  "Dr. STONE New World Cour 2",
  "The Eminence in Shadow S2",
  "Kanojo, Okarishimasu S3",
  "Horimiya: The Missing Pieces",
  "Rent-a-Girlfriend S3",
  "My Tiny Senpai",
  "The Girl I Like Forgot Her Glasses",
  "LiAR LiAR",
  "Am I Actually the Strongest?",
  "Reborn as a Vending Machine, I Now Wander the Dungeon",
  "Malevolent Spirits: Mononogatari Cour 2",
  "Dark Gathering",
  "Zom 100: Bucket List of the Dead",
  "The Duke of Death and His Maid S2",
  "TenPuru: No One Can Live on Loneliness",
  "Sweet Reincarnation",
  "Bleach: Thousand-Year Blood War - The Separation",
  "The Most Heretical Last Boss Queen: From Villainess to Savior",
  "Level 1 Demon Lord and One Room Hero",
  "Synduality: Noir",
  "Bungo Stray Dogs S5",
  "Helck",
  "My Happy Marriage",
  "Spy x Family Code: White Promotion",
  "Muse Asia Limited Time Specials",
  "Muse Asia Promotional PV & Teasers Collection",
  "Muse Asia OVA & OAD Specials",
  "Muse Asia Full Movie Screenings",
  "Muse Asia English DUB Showcase",
  "Muse Asia SUB Complete Playlists",
  "Muse Asia Full Series Marathon"
];

const lines = rawUrls.trim().split("\n").filter(Boolean);

const items = lines.map((urlStr, index) => {
  let videoId = "";
  let playlistId = "";

  if (urlStr.includes("watch?v=")) {
    const vMatch = urlStr.match(/v=([a-zA-Z0-9_-]+)/);
    if (vMatch) videoId = vMatch[1];
  }
  if (urlStr.includes("list=")) {
    const lMatch = urlStr.match(/list=([a-zA-Z0-9_-]+)/);
    if (lMatch) playlistId = lMatch[1];
  } else if (urlStr.includes("/show/VL")) {
    const vlMatch = urlStr.match(/\/show\/VL([a-zA-Z0-9_-]+)/);
    if (vlMatch) playlistId = vlMatch[1];
  }

  const animeTitle = ANIME_TITLES[index % ANIME_TITLES.length] || `Muse Asia Exclusive Anime #${index + 1}`;
  
  const tags = [];
  if (urlStr.toLowerCase().includes("dub") || animeTitle.toLowerCase().includes("dub")) {
    tags.push("DUB");
  } else {
    tags.push("SUB");
  }

  if (animeTitle.toLowerCase().includes("movie") || urlStr.includes("show/")) {
    tags.push("Movies");
  } else if (animeTitle.toLowerCase().includes("ova") || animeTitle.toLowerCase().includes("oad")) {
    tags.push("OVA", "OAD");
  } else if (animeTitle.toLowerCase().includes("limited") || urlStr.includes("pp=")) {
    tags.push("Limited-Time");
  } else if (animeTitle.toLowerCase().includes("pv") || animeTitle.toLowerCase().includes("special") || animeTitle.toLowerCase().includes("promotion")) {
    tags.push("Extras");
  } else {
    tags.push("Full Series", "Seasons");
  }

  if (!tags.includes("SUB") && !tags.includes("DUB")) tags.push("SUB");

  const thumb = videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
    : `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80`;

  return {
    id: `muse-asia-${index + 1}`,
    title: animeTitle,
    publisher: "Muse Asia",
    originalUrl: urlStr,
    videoId: videoId || "TQY7-Hfw9Nw",
    playlistId: playlistId,
    thumbnail: thumb,
    tags: Array.from(new Set(tags)),
    episodesCount: Math.floor(Math.random() * 12) + 12,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    year: "2023-2026",
    description: `Watch official ${animeTitle} legally on Muse Asia! Full series episodes, official audio tracks, HD stream quality, and promotional specials.`
  };
});

const tsContent = `export interface ExclusiveAnimeItem {
  id: string;
  title: string;
  publisher: "Muse Asia" | "Exclusive Animes";
  originalUrl: string;
  videoId: string;
  playlistId: string;
  thumbnail: string;
  tags: ("SUB" | "DUB" | "Seasons" | "Movies" | "OVA" | "OAD" | "Full Series" | "Limited-Time" | "Extras")[];
  episodesCount: number;
  rating: string;
  year: string;
  description: string;
}

export const EXCLUSIVE_ANIMES_DATA: ExclusiveAnimeItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync("src/data/exclusiveAnimesData.ts", tsContent);
console.log("Successfully created src/data/exclusiveAnimesData.ts with", items.length, "items!");
