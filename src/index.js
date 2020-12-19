import ReactDOM from 'react-dom'
import * as THREE from 'three'
import React, { useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import { useSprings, a } from 'react-spring/three'
import './styles.css'

// 作成するボックスの数
const number = 35
// 使用する色の配列
const colors = ['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']

//　アニメーションの変更後の位置や色などの設定
const random = (i) => {
  const r = Math.random()
  return {
    //　ランダムな座標を設定 z軸は各オブジェクトで固定
    position: [100 - Math.random() * 200, 100 - Math.random() * 200, i * 1.5],
    // 色の配列からランダムに一つ選び設定
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    // ランダムな大きさ z軸は固定
    scale: [1 + r * 14, 1 + r * 14, 1],
    // ランダムに回転
    rotation: [0, 0, THREE.Math.degToRad(Math.round(Math.random()) * 45)]
  }
}

/**
 * const number = 35 の要素数の配列を作成
 * それぞれランダムは値の配列を新しく作成する
 */
const data = new Array(number).fill().map(() => {
  return {
    color: colors[Math.round(Math.random() * (colors.length - 1))],
    // boxの大きさ
    args: [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10]
  }
})

/**
 * 3.メインコンテンツ
 * 複数のボックスが、ランダムな位置や色へ変わるのを繰り返す
 */
function Content() {
  /**
   * https://www.react-spring.io/docs/hooks/api
   * useSprings 固有のプロパティ設定を持つ複数のSpringオブジェクトを生成
   *
   * const number = 35　の数だけ作成
   * 最初の設定
   */
  const [springs, setSprings] = useSprings(number, (i) => ({
    from: random(i),
    to: random(i),
    config: { mass: 20, tension: 150, friction: 50 }
  }))

  useEffect(
    () =>
      // 一定時間ごとに処理をおこなう
      void setInterval(
        () =>
          // set
          setSprings((i) => ({ to: random(i), delay: i * 40 })),
        // 3秒ごとに実行
        3000
      ),
    //空要素にすることにより
    //マウント・アンマウント時のみ第１引数の関数を実行
    []
  )
  /**
   * ファイル上部にある「const data」で作成された配列分だけmeshを作成
   */
  return data.map((d, index) => (
    <a.mesh key={index} {...springs[index]} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={d.args} />
      <a.meshStandardMaterial attach="material" color={springs[index].color} roughness={0.75} metalness={0.5} />
    </a.mesh>
  ))
}

/**
 * 2.ライトの追加
 */
function Lights() {
  return (
    <group>
      <pointLight intensity={0.3} />
      <ambientLight intensity={2} />
      <spotLight
        // このオブジェクトから影を発生させる
        castShadow
        intensity={0.2}
        angle={Math.PI / 7}
        position={[150, 150, 250]}
        // ターゲットからの光の減衰
        penumbra={1}
        // 影の細かさ
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}

/**
 * 1.プログラムのスタート地点
 */
export default function App() {
  return (
    // 影の描画を有効 カメラの位置 視野角
    <Canvas shadowMap camera={{ position: [0, 0, 100], fov: 100 }}>
      {/* function Lights() */}
      <Lights />
      {/* function Content() */}
      <Content />
    </Canvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
