using System;
using System.Numerics;
using System.Windows;
using System.Windows.Threading;
using System.Windows.Media;

namespace Server
{
    public partial class MainWindow : Window
    {
        // Constante de Boltzmann sans les zéros : 138649
        private const long Seed = 738649254;
        private string currentOTP;
        private string previousOTP;
        private int attempts = 5;
        private DispatcherTimer timer;

        public MainWindow()
        {
            InitializeComponent();
            InitializeTimer();
            UpdateOTP();
            txtPrevious.Text = "OTP précédent: Aucun";
        }

        private void InitializeTimer()
        {
            timer = new DispatcherTimer();
            timer.Interval = TimeSpan.FromSeconds(1);
            timer.Tick += (s, e) => UpdateOTP();
            timer.Start();
        }

        private void UpdateOTP()
        {
            var timeWindow = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 60;
            string newOTP = GenerateOTP(timeWindow);

            if (newOTP != currentOTP)
            {
                previousOTP = currentOTP;
                currentOTP = newOTP;
                txtPrevious.Text = $"OTP précédent: {previousOTP ?? "Aucun"}";
            }
        }

        private string GenerateOTP(long timeWindow)
        {
            const double goldenRatio = 1.6180339887498948482;
            BigInteger prime = 9574966967627724076; // Même nombre premier que le client
            
            // Mêmes calculs que côté client
            double phiComponent = Math.Pow(goldenRatio, (double)(Seed % 100 + timeWindow % 100));
            long transformedSeed = (long)(Seed * phiComponent);
            
            BigInteger combined = new BigInteger(transformedSeed ^ timeWindow);
            combined = (combined % prime) * (combined + prime);
            
            for(int i = 0; i < 3; i++)
            {
                combined = combined * (combined % 1000000007) + (combined >> 32);
                combined = combined ^ (combined << 16);
            }
            
            string otpString = combined.ToString().PadLeft(20, '0');
            int startIndex = (int)(combined % 12);
            return otpString.Substring(startIndex, 8);
        }

        private void BtnValidate_Click(object sender, RoutedEventArgs e)
        {
            if (txtInput.Text == currentOTP)
            {
                txtResult.Text = "✅ Accès confirmé !";
                txtResult.Foreground = new SolidColorBrush(Color.FromRgb(39, 174, 96));
                attempts = 5;
            }
            else
            {
                if (--attempts <= 0)
                {
                    txtResult.Text = "❌ Trop de tentatives - Fermeture !";
                    txtResult.Foreground = new SolidColorBrush(Color.FromRgb(192, 57, 43));
                    var timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(2) };
                    timer.Tick += (s, args) =>
                    {
                        timer.Stop();
                        Application.Current.Shutdown();
                    };
                    timer.Start();
                }
                else
                {
                    txtResult.Text = $"❌ Accès refusé ! {attempts} tentative{(attempts > 1 ? "s" : "")} restante{(attempts > 1 ? "s" : "")}";
                    txtResult.Foreground = new SolidColorBrush(Color.FromRgb(231, 76, 60));
                }
            }
            txtInput.Clear();
        }
    }
}