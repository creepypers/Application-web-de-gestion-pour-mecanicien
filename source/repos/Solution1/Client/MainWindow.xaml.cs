using System;
using System.Numerics;
using System.Windows;
using System.Windows.Threading;
using System.Windows.Media;

namespace Client
{
    public partial class MainWindow : Window
    {
        private const long Seed = 738649254;
        private DispatcherTimer timer;
        private DateTimeOffset lastUpdateTime;

        public MainWindow()
        {
            InitializeComponent();
            InitializeTimer();
            UpdateDisplay();
        }

        private void InitializeTimer()
        {
            timer = new DispatcherTimer();
            timer.Interval = TimeSpan.FromSeconds(1);
            timer.Tick += (s, e) => UpdateDisplay();
            timer.Start();
        }

        private void UpdateDisplay()
        {
            var timeWindow = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 60;
            string newOTP = GenerateOTP(timeWindow);
            
            txtOTP.Text = newOTP;
            
            var now = DateTimeOffset.UtcNow;
            var secondsRemaining = 60 - now.Second;
            txtTimer.Text = $"🕒 Actualisation dans {secondsRemaining:D2} secondes";
        }

        private string GenerateOTP(long timeWindow)
        {
            const double goldenRatio = 1.6180339887498948482;
            BigInteger prime = 9574966967627724076; // Grand nombre premier
            
            // Étape 1: Combinaison non linéaire avec le nombre d'or
            double phiComponent = Math.Pow(goldenRatio, (double)(Seed % 100 + timeWindow % 100));
            long transformedSeed = (long)(Seed * phiComponent);
            
            // Étape 2: Transformation cryptographique
            BigInteger combined = new BigInteger(transformedSeed ^ timeWindow);
            combined = (combined % prime) * (combined + prime);
            
            // Étape 3: Mélange chaotique
            for(int i = 0; i < 3; i++)
            {
                combined = combined * (combined % 1000000007) + (combined >> 32);
                combined = combined ^ (combined << 16);
            }
            
            // Étape 4: Normalisation
            string otpString = combined.ToString().PadLeft(20, '0'); // 20 chiffres
            
            // Étape 5: Extraction dynamique
            int startIndex = (int)(combined % 12); // 20 - 8 = 12 positions possibles
            return otpString.Substring(startIndex, 8);
        }

        private void BtnCopy_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(txtOTP.Text))
            {
                Clipboard.SetText(txtOTP.Text);
                
                
                var timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(500) };
                timer.Tick += (s, args) =>
                {
                    timer.Stop();
                };
                timer.Start();
            }
        }
    }
}